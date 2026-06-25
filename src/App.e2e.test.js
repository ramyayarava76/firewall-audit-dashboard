import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { uploadFile } from './utils/api';

let mockLocation = { pathname: '/', state: null };
const mockRouterSubscribers = new Set();

jest.mock('react-router-dom', () => {
  const React = require('react');

  const notifyRouteChange = () => {
    mockRouterSubscribers.forEach((setTick) => {
      setTick((count) => count + 1);
    });
  };

  const useRouteRefresh = () => {
    const [, setTick] = React.useState(0);

    React.useEffect(() => {
      mockRouterSubscribers.add(setTick);
      return () => mockRouterSubscribers.delete(setTick);
    }, []);
  };

  return {
    Routes: ({ children }) => {
      useRouteRefresh();
      const allRoutes = React.Children.toArray(children);
      const match = allRoutes.find((child) => child.props.path === mockLocation.pathname);
      return match ? match.props.element : null;
    },
    Route: () => null,
    useNavigate: () => (to, options = {}) => {
      mockLocation = { pathname: to, state: options.state || null };
      notifyRouteChange();
    },
    useLocation: () => {
      useRouteRefresh();
      return mockLocation;
    },
  };
}, { virtual: true });

jest.mock('./utils/api', () => ({
  uploadFile: jest.fn(),
}));

// Stub charts in tests to avoid canvas context issues in jsdom.
jest.mock('./components/Charts', () => () => <div data-testid="charts-stub">Charts</div>);

describe('App end-to-end flow', () => {
  beforeEach(() => {
    mockLocation = { pathname: '/', state: null };
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('uploads a file and navigates to dashboard with rendered results', async () => {
    uploadFile.mockResolvedValue({
      data: {
        message: 'processed',
        filename: 'audit.csv',
        username: 'tester',
        summary: {
          total: 2,
          allowed: 1,
          blocked: 1,
          other: 0,
          totalRules: 2,
          riskCount: 1,
        },
        entries: [
          {
            id: 1,
            action: 'ALLOW',
            protocol: 'TCP',
            port: '443',
            source_ip: '10.0.0.1',
            dest_ip: '10.0.0.2',
          },
        ],
      },
      error: null,
    });

    render(<App />);

    const input = screen.getByLabelText(/choose file/i);
    const file = new File(['a,b'], 'audit.csv', { type: 'text/csv' });

    await userEvent.upload(input, file);
    await userEvent.click(screen.getByRole('button', { name: /^upload$/i }));

    expect(uploadFile).toHaveBeenCalledWith(file);
    expect(await screen.findByRole('heading', { name: /audit results/i })).toBeInTheDocument();
    expect(screen.getByText(/file:/i)).toHaveTextContent('audit.csv');
    expect(screen.getByText(/risk overview/i)).toBeInTheDocument();
    expect(screen.getByText(/firewall rules/i)).toBeInTheDocument();
    expect(screen.getByTitle('action: ALLOW')).toBeInTheDocument();
    expect(screen.getByTestId('charts-stub')).toBeInTheDocument();
  });
});
