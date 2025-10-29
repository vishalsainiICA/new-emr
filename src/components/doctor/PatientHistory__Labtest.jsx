
import { useState } from 'react';

export function LabTest({ labTest = [], labTestError, labTestloading, onclose, setselectedLabTest, selectedLabTest }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLabtest, setFilteredLabtest] = useState(labTest);


    // if (labTestError) {
    //     return <p style={{ color: 'red' }}>Error: {labTestError}</p>;
    // }

    // Filter logic

    const handleAddLabtest = (labtest) => {
        const isSelected = selectedLabTest.some((t) => t.test === labtest.test);

        if (isSelected) {
            // 🔹 If already selected → remove it
            setselectedLabTest((prev) => prev.filter((t) => t.test !== labtest.test));
        } else {
            // 🔹 If not selected → add it
            setselectedLabTest((prev) => [...prev, labtest]);
        }
    };


    const handlechange = (value) => {
        if (value.trim() === '') {
            setFilteredLabtest(labTest)
        }
        const filtered = labTest.filter((item) => {
            return item?.test?.toLowerCase().startsWith(value.toLowerCase())
        })
        setFilteredLabtest(filtered)
    }

    return (
        <div style={{
            padding: '20px',
            maxHeight: '700px',
            minHeight: "700px",
            backgroundColor: '#fff',
            msOverflowX: 'scroll',
            borderRadius: '20px',
            overflowY: 'auto',
            maxWidth: '900px',
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
                    <button
                        onClick={() => onclose?.(null)}
                        style={{
                            padding: '10px',
                            fontSize: '12px',
                            width: '105px',
                            border: '1px solid gray',
                            marginRight: '10px'
                        }}>Save</button>
                    <i
                        onClick={() => {
                            onclose?.(null)
                            // setselectedLabTest([])
                        }}
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
                    type='search'
                    placeholder="Search lab test..."
                    onChange={(e) => handlechange(e.target.value)}
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
                        gap: '10px'
                    }}>
                        {console.log('filterlsbtest', filteredLabtest)
                        }
                        {
                            filteredLabtest.length > 0 ? (
                                filteredLabtest.map((test, i) => {
                                    const isSelected = selectedLabTest.some((t) => t.test === test.test);

                                    return (
                                        <div
                                            onClick={() => handleAddLabtest(test)}
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                cursor: 'pointer',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                border: '1px solid lightgray',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                marginBottom: '8px',
                                                backgroundColor: isSelected ? '#e0f7fa' : '#fafafa', // highlight selected
                                                transition: '0.2s'
                                            }}
                                        >
                                            <div>
                                                <h4 style={{ margin: 0 }}>{test.test}</h4>
                                                <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>
                                                    {test.disease}
                                                </p>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span
                                                    style={{
                                                        fontSize: '13px',
                                                        color: test.confidence > 0.5 ? 'green' : 'gray'
                                                    }}
                                                >
                                                    Confidence: {(test.confidence * 100).toFixed(0)}%
                                                </span>

                                                <input
                                                    type="radio"
                                                    checked={isSelected}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    );
                                })

                            ) : (
                                <p style={{ textAlign: 'center', color: '#777' }}>No lab tests found</p>
                            )}

                    </div>
                )
            }


        </div>
    );
}
