import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Upload from './Upload';
import { uploadFile } from '../utils/api';

jest.mock('../utils/api', () => ({
  uploadFile: jest.fn(),
}));

describe('Upload component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('keeps upload button disabled until a file is selected', () => {
    render(<Upload onUploadSuccess={jest.fn()} />);

    expect(screen.getByRole('button', { name: /upload/i })).toBeDisabled();
  });

  it('uploads selected file and calls success callback', async () => {
    const onUploadSuccess = jest.fn();
    uploadFile.mockResolvedValue({
      data: {
        message: 'processed',
        username: 'tester',
        filename: 'audit.csv',
      },
      error: null,
    });

    render(<Upload onUploadSuccess={onUploadSuccess} />);

    const input = screen.getByLabelText(/choose file/i);
    const file = new File(['log,data'], 'audit.csv', { type: 'text/csv' });
    await userEvent.upload(input, file);

    await userEvent.click(screen.getByRole('button', { name: /^upload$/i }));

    expect(uploadFile).toHaveBeenCalledWith(file);
    expect(await screen.findByText(/uploaded by: tester/i)).toBeInTheDocument();
    expect(onUploadSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ filename: 'audit.csv' })
    );
  });

  it('shows backend error when upload fails', async () => {
    uploadFile.mockResolvedValue({ data: null, error: 'Unsupported file type' });

    render(<Upload onUploadSuccess={jest.fn()} />);

    const input = screen.getByLabelText(/choose file/i);
    const file = new File(['bad'], 'audit.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);

    await userEvent.click(screen.getByRole('button', { name: /^upload$/i }));

    expect(await screen.findByText(/upload failed: unsupported file type/i)).toBeInTheDocument();
  });
});
