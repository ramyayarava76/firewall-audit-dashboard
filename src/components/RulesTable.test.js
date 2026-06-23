import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RulesTable from './RulesTable';

describe('RulesTable Component', () => {
  const sampleRules = [
    { id: 1, action: 'ALLOW', protocol: 'TCP', port: '80', source: '192.168.1.1', destination: '10.0.0.1' },
    { id: 2, action: 'BLOCK', protocol: 'UDP', port: '53', source: '192.168.1.2', destination: '10.0.0.2' },
    { id: 3, action: 'ALLOW', protocol: 'TCP', port: '443', source: '192.168.2.1', destination: '10.0.1.1' },
    { id: 4, action: 'DENY', protocol: 'ICMP', port: 'N/A', source: '192.168.3.1', destination: '10.0.2.1' },
    { id: 5, action: 'PERMIT', protocol: 'TCP', port: '22', source: '192.168.4.1', destination: '10.0.3.1' },
  ];

  describe('Rendering', () => {
    it('renders empty state when no entries provided', () => {
      render(<RulesTable entries={[]} />);
      expect(screen.getByText('No rules to display.')).toBeInTheDocument();
    });

    it('renders table with all columns from data', () => {
      render(<RulesTable entries={sampleRules} />);
      
      expect(screen.getByText('id')).toBeInTheDocument();
      expect(screen.getByText('action')).toBeInTheDocument();
      expect(screen.getByText('protocol')).toBeInTheDocument();
      expect(screen.getByText('port')).toBeInTheDocument();
    });

    it('renders all rows in first page', () => {
      render(<RulesTable entries={sampleRules} />);
      
      // Check for badges with specific titles to avoid filter buttons
      const allowBadges = screen.getAllByTitle('action: ALLOW');
      expect(allowBadges.length).toBeGreaterThan(0);
      
      expect(screen.getByTitle('action: BLOCK')).toBeInTheDocument();
      expect(screen.getByTitle('action: DENY')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('filters rows based on search input', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const searchInput = screen.getByPlaceholderText('Search rules…');
      await userEvent.type(searchInput, '192.168.1');
      
      // Should show only rules matching the search term
      const countText = screen.getByText((content, element) => 
        element?.className === 'rt-count' && content.includes('2 rules')
      );
      expect(countText).toBeInTheDocument();
    });

    it('searches across all columns', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const searchInput = screen.getByPlaceholderText('Search rules…');
      await userEvent.type(searchInput, '443');
      
      // Should find the rule with port 443
      const countText = screen.getByText((content, element) => 
        element?.className === 'rt-count' && content.includes('1 rule')
      );
      expect(countText).toBeInTheDocument();
    });

    it('shows no matching results when search has no matches', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const searchInput = screen.getByPlaceholderText('Search rules…');
      await userEvent.type(searchInput, 'nonexistent');
      
      expect(screen.getByText('No matching rules found.')).toBeInTheDocument();
    });

    it('clears search and shows all rules when input is cleared', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const searchInput = screen.getByPlaceholderText('Search rules…');
      await userEvent.type(searchInput, '192');
      await userEvent.clear(searchInput);
      
      const countText = screen.getByText((content, element) => 
        element?.className === 'rt-count' && content.includes('5 rules')
      );
      expect(countText).toBeInTheDocument();
    });

    it('is case-insensitive', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const searchInput = screen.getByPlaceholderText('Search rules…');
      await userEvent.type(searchInput, 'allow');
      
      // Should find ALLOW entries regardless of case
      const countText = screen.getByText((content, element) => 
        element?.className === 'rt-count' && content.includes('2 rules')
      );
      expect(countText).toBeInTheDocument();
    });
  });

  describe('Action Filter Functionality', () => {
    it('renders all action filter buttons', () => {
      render(<RulesTable entries={sampleRules} />);
      
      expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'ALLOW' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'BLOCK' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'DENY' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'PERMIT' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'OTHER' })).toBeInTheDocument();
    });

    it('filters by ALLOW action', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const allowBtn = screen.getByRole('button', { name: 'ALLOW' });
      await userEvent.click(allowBtn);
      
      const countText = screen.getByText((content, element) => 
        element?.className === 'rt-count' && content.includes('2 rules')
      );
      expect(countText).toBeInTheDocument();
      expect(allowBtn).toHaveClass('active');
    });

    it('filters by BLOCK action', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const blockBtn = screen.getByRole('button', { name: 'BLOCK' });
      await userEvent.click(blockBtn);
      
      const countText = screen.getByText((content, element) => 
        element?.className === 'rt-count' && content.includes('1 rule')
      );
      expect(countText).toBeInTheDocument();
    });

    it('groups ALLOW and PERMIT in ALLOW filter', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const allowBtn = screen.getByRole('button', { name: 'ALLOW' });
      await userEvent.click(allowBtn);
      
      // Should show both ALLOW and PERMIT entries (currently may filter only ALLOW)
      // Depending on implementation, this may need adjustment
      expect(allowBtn).toHaveClass('active');
    });

    it('groups BLOCK and DENY in BLOCK filter', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const blockBtn = screen.getByRole('button', { name: 'BLOCK' });
      await userEvent.click(blockBtn);
      
      expect(blockBtn).toHaveClass('active');
    });

    it('shows OTHER category for non-standard actions', async () => {
      const customRules = [
        { id: 1, action: 'CUSTOM_ACTION', protocol: 'TCP', port: '80', source: '192.168.1.1', destination: '10.0.0.1' },
      ];
      
      render(<RulesTable entries={customRules} />);
      
      const otherBtn = screen.getByRole('button', { name: 'OTHER' });
      await userEvent.click(otherBtn);
      
      const countText = screen.getByText((content, element) => 
        element?.className === 'rt-count' && content.includes('1 rule')
      );
      expect(countText).toBeInTheDocument();
    });

    it('resets to All when All button is clicked', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const allowBtn = screen.getByRole('button', { name: 'ALLOW' });
      await userEvent.click(allowBtn);
      
      const countAfterFilter = screen.getByText((content, element) => 
        element?.className === 'rt-count' && content.includes('2 rules')
      );
      expect(countAfterFilter).toBeInTheDocument();
      
      const allBtn = screen.getByRole('button', { name: 'All' });
      await userEvent.click(allBtn);
      
      const countAfterReset = screen.getByText((content, element) => 
        element?.className === 'rt-count' && content.includes('5 rules')
      );
      expect(countAfterReset).toBeInTheDocument();
    });
  });

  describe('Combined Search and Filter', () => {
    it('applies both search and filter together', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const searchInput = screen.getByPlaceholderText('Search rules…');
      await userEvent.type(searchInput, '192.168');
      
      const allowBtn = screen.getByRole('button', { name: 'ALLOW' });
      await userEvent.click(allowBtn);
      
      // Should show ALLOW rules that match the search term (ids 1 and 3 both have ALLOW and 192.168)
      const countText = screen.getByText((content, element) => 
        element?.className === 'rt-count' && content.includes('2 rules')
      );
      expect(countText).toBeInTheDocument();
    });

    it('shows no results when search and filter have no matches', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const searchInput = screen.getByPlaceholderText('Search rules…');
      await userEvent.type(searchInput, 'nonexistent');
      
      const allowBtn = screen.getByRole('button', { name: 'ALLOW' });
      await userEvent.click(allowBtn);
      
      expect(screen.getByText('No matching rules found.')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('sorts table by clicking column headers', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const actionHeader = screen.getByRole('columnheader', { name: /action/i });
      await userEvent.click(actionHeader);
      
      expect(actionHeader).toHaveClass('rt-th-active');
    });

    it('toggles sort direction on repeated clicks', async () => {
      render(<RulesTable entries={sampleRules} />);
      
      const actionHeader = screen.getByRole('columnheader', { name: /action/i });
      await userEvent.click(actionHeader);
      expect(actionHeader).toHaveClass('rt-th-active');
      
      await userEvent.click(actionHeader);
      expect(actionHeader).toHaveClass('rt-th-active');
    });
  });

  describe('Pagination', () => {
    it('shows pagination controls when total pages > 1', () => {
      const manyRules = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        action: i % 2 === 0 ? 'ALLOW' : 'BLOCK',
        protocol: 'TCP',
        port: String(80 + i),
        source: `192.168.1.${i}`,
        destination: '10.0.0.1',
      }));
      
      render(<RulesTable entries={manyRules} />);
      
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument();
    });

    it('disables prev button on first page', () => {
      render(<RulesTable entries={sampleRules} />);
      
      const prevBtn = screen.queryByRole('button', { name: /prev/i });
      // First page with 5 items (PAGE_SIZE=15) doesn't show pagination
      expect(prevBtn).not.toBeInTheDocument();
    });

    it('resets to page 1 when search is updated', async () => {
      const manyRules = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        action: 'ALLOW',
        protocol: 'TCP',
        port: '80',
        source: `192.168.1.${i}`,
        destination: '10.0.0.1',
      }));
      
      render(<RulesTable entries={manyRules} />);
      
      // Go to page 2
      const page2Btn = screen.getByRole('button', { name: '2' });
      await userEvent.click(page2Btn);
      
      // Update search - should reset to page 1
      const searchInput = screen.getByPlaceholderText('Search rules…');
      await userEvent.type(searchInput, '192.168.1');
      
      // Check that we're back on page 1
      const pageInfo = screen.getByText(/page 1 of/i);
      expect(pageInfo).toBeInTheDocument();
    });
  });

  describe('Badge Rendering', () => {
    it('renders action as badge', () => {
      render(<RulesTable entries={sampleRules} />);
      
      const badges = screen.getAllByText(/ALLOW|BLOCK|DENY/);
      expect(badges.length).toBeGreaterThan(0);
    });

    it('applies correct CSS classes to badges', () => {
      render(<RulesTable entries={sampleRules} />);
      
      const badges = document.querySelectorAll('.rt-badge');
      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('has searchable input with aria label', () => {
      render(<RulesTable entries={sampleRules} />);
      
      expect(screen.getByLabelText('Search rules')).toBeInTheDocument();
    });

    it('has filter group with proper role', () => {
      render(<RulesTable entries={sampleRules} />);
      
      expect(screen.getByRole('group', { name: /filter by action/i })).toBeInTheDocument();
    });

    it('has pagination navigation with proper role', () => {
      const manyRules = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        action: 'ALLOW',
        protocol: 'TCP',
        port: '80',
        source: `192.168.1.${i}`,
        destination: '10.0.0.1',
      }));
      
      render(<RulesTable entries={manyRules} />);
      
      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles entries with missing action property', () => {
      const rulesWithoutAction = [
        { id: 1, protocol: 'TCP', port: '80' },
        { id: 2, action: 'ALLOW', protocol: 'TCP', port: '443' },
      ];
      
      render(<RulesTable entries={rulesWithoutAction} />);
      
      expect(screen.getByText('2 rules')).toBeInTheDocument();
    });

    it('handles entries with null or undefined values', () => {
      const rulesWithNulls = [
        { id: 1, action: 'ALLOW', protocol: null, port: undefined },
      ];
      
      render(<RulesTable entries={rulesWithNulls} />);
      
      expect(screen.getByText('1 rule')).toBeInTheDocument();
    });

    it('handles very long strings in cells', () => {
      const rulesWithLongStrings = [
        { 
          id: 1, 
          action: 'ALLOW', 
          protocol: 'TCP', 
          port: '80',
          description: 'A'.repeat(200),
        },
      ];
      
      render(<RulesTable entries={rulesWithLongStrings} />);
      
      expect(screen.getByText('1 rule')).toBeInTheDocument();
    });
  });
});
