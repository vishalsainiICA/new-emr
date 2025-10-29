
import { useState } from 'react';

export function LabTest({ labTest = [], labTestError, labTestloading, onclose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTest, setSelectedTest] = useState(null);

    if (labTestloading) {
        return <p>Loading lab tests...</p>;
    }

    // if (labTestError) {
    //     return <p style={{ color: 'red' }}>Error: {labTestError}</p>;
    // }

    // Filter logic
    const filteredTests = labTest.filter(test =>
        test.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{
            padding: '20px',
            maxHeight: '700px',
            minHeight: "700px",
            backgroundColor: '#fff',
            msOverflowX: 'scroll',
            borderRadius: '20px',
            overflowY: 'auto',
            minWidth: '900px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
            {/* Heading */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <h4 style={{
                    marginBottom: '15px',
                    color: '#333',

                    fontWeight: '600'
                }}>
                    Select Lab Tests
                </h4>
                <i
                    onClick={() => onclose?.(null)}
                    className="ri-close-large-fill"
                    style={{
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#666',
                        transition: '0.3s',
                    }}
                    onMouseOver={(e) => e.target.style.color = 'red'}
                    onMouseOut={(e) => e.target.style.color = '#666'}
                ></i>
            </div>



            {/* 🔍 Filter/Search box */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px'
            }}>
                <input
                    type="text"
                    placeholder="Search lab test..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '80%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '14px'
                    }}
                />
            </div>

            {/* 🧪 Test List */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
            }}>
                {filteredTests.length > 0 ? (
                    filteredTests.map((test, i) => (
                        <label
                            key={i}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '10px',
                                padding: '10px',
                                cursor: 'pointer',
                                transition: '0.3s',
                                backgroundColor:
                                    selectedTest === test.name ? '#e8f4ff' : '#fff'
                            }}
                        >
                            <input
                                type="radio"
                                name="labTestSelect"
                                value={test.name}
                                checked={selectedTest === test.name}
                                onChange={() => setSelectedTest(test.name)}
                            />
                            <span>{test.name || 'Unnamed Test'}</span>
                        </label>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#777' }}>
                        No lab tests found
                    </p>
                )}
            </div>

            {/* 🧾 Selected test info */}
            {selectedTest && (
                <div style={{
                    marginTop: '20px',
                    textAlign: 'center',
                    color: '#333',
                    fontWeight: '500'
                }}>
                    Selected Test: <span style={{ color: '#007bff' }}>{selectedTest}</span>
                </div>
            )}
        </div>
    );
}
