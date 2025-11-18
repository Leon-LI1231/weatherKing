// BetHistory.jsx - Component to display user's bet history

import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * ===============================
 *        BetHistory Component
 * ===============================
 * 
 * This component displays the user's bet history in a tabular format on the UserPage.
 * It fetches the bet data from the backend and populates the table with relevant details.
 * The table includes columns for Contest, City, Type, Odds, Outcome, Date, and Payout.
 * User can see all their past bets together or filtered by specific criteria such as city, contest, or Outcome.
 * 
 * Props:
 *  - username: the username of the user whose bet history is to be displayed
 *  - BetHistoryFilter: an optional filter object to filter bets by city, contest, or outcome
 *  - onFilterChange: a callback function that is called when the filter changes
 */

function BetHistory({ username, filter }) {
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBetHistory = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/bet-history/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch bet history');
                }
                const data = await response.json();
                setBets(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBetHistory();
    }, [username, filter]);

    // Apply filtering based on the filter prop
    const filteredBets = bets.filter(bet => {
        if (filter.city && !bet.city.toLowerCase().includes(filter.city.toLowerCase())) {
            return false;
        }
        if (filter.contest && !bet.contest.toLowerCase().includes(filter.contest.toLowerCase())) {
            return false;
        }
        if (filter.outcome && !bet.outcome.toLowerCase().includes(filter.outcome.toLowerCase())) {
            return false;
        }
        return true;
    });

    if (loading) {
        return <div>Loading bet history...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Contest</th>
                    <th>City</th>
                    <th>Type</th>
                    <th>Odds</th>
                    <th>Outcome</th>
                    <th>Date</th>
                    <th>Payout</th>
                </tr>
            </thead>
            <tbody>
                {filteredBets.map((bet, index) => (
                    <tr key={index}>
                        <td>{bet.contest}</td>
                        <td>{bet.city}</td>
                        <td>{bet.type}</td>
                        <td>{bet.odds}</td>
                        <td>
                            <span style={{
                                backgroundColor: bet.outcome === 'Hit!' ? '#28a745' : bet.outcome === 'Miss!' ? '#dc3545' : 'transparent',
                                color: bet.outcome === 'Hit!' || bet.outcome === 'Miss!' ? 'white' : 'inherit',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                display: 'inline-block'
                            }}>
                                {bet.outcome}
                            </span>
                        </td>
                        <td>{new Date(bet.date).toLocaleDateString()}</td>
                        <td>${bet.payout.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}