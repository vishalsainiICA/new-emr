
import { useState } from 'react';

export function LabTest({ labTest = [], labTestError, labTestloading, onclose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTest, setSelectedTest] = useState(null);

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
                justifyContent: 'space-between',
                marginBottom: '10px'
            }}>
                <h4 style={{
                    marginBottom: '15px',
                    color: '#333',
                    fontWeight: '600'
                }}>
                    Select Lab Tests
                </h4>
                <div>
                    <button style={{
                        padding: '10px',
                        fontSize: '12px',
                        width: '105px',
                        border: '1px solid gray',
                        marginRight: '10px'
                    }}>Save</button>
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

            </div>
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
            {labTestloading && (
                <p>Loading.....</p>
            )}
            {
                labTestError && (
                    <p style={{
                        color: 'red'

                    }}>Error :{labTestError}</p>
                )
            }
            {
                !labTestloading && !labTestError && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px'
                    }}>
                        {filteredTests.length > 0 ? (
                            filteredTests.map((test, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '1px solid lightgray',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    backgroundColor: '#fafafa'
                                }}>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{test.test}</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>
                                            {test.disease}
                                        </p>
                                    </div>
                                    <span style={{
                                        fontSize: '13px',
                                        color: test.confidence > 0.5 ? 'green' : 'gray'
                                    }}>
                                        Confidence: {(test.confidence * 100).toFixed(0)}%
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#777' }}>No lab tests found</p>
                        )}

                    </div>
                )
            }


        </div>
    );
}
