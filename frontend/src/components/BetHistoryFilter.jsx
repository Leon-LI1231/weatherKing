// BetHistoryFilter.jsx - Component to filter bet history

import React, { useState } from 'react';

/**
 * =============================================
 *        BetHistoryFilter Component
 * =============================================
 *
 * This component provides a filter interface for the BetHistory component.
 * It allows users to filter their bet history by city, contest, or outcome.
 *
 * Props:
 *  - onFilterChange: a callback function that is called when the filter changes
 *  - initialFilter: an optional initial filter object
 */

function BetHistoryFilter({ onFilterChange, initialFilter = {} }) {
    const [city, setCity] = useState(initialFilter.city || '');
    const [contest, setContest] = useState(initialFilter.contest || '');
    const [outcome, setOutcome] = useState(initialFilter.outcome || '');

    const handleFilterChange = () => {
        onFilterChange({ city, contest, outcome });
    }

    React.useEffect(() => {
        handleFilterChange();
    }, [city, contest, outcome]);

    return (
        <div className="bet-history-filter">
            <input
                type="text"
                placeholder="Filter by city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <input
                type="text"
                placeholder="Filter by contest"
                value={contest}
                onChange={(e) => setContest(e.target.value)}
            />
            <input
                type="text"
                placeholder="Filter by outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
            />
        </div>
    );
}

export default BetHistoryFilter;