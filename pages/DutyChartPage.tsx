import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import * as api from '../services/api';
import { DutyChartData, DutyAssignment } from '../types';
import { Edit, Save, X } from 'lucide-react';

interface DutyAssignmentCardProps {
    assignment: DutyAssignment;
    isEditing: boolean;
    onUpdate: (newOfficers: string[]) => void;
}

const DutyAssignmentCard: React.FC<DutyAssignmentCardProps> = ({ assignment, isEditing, onUpdate }) => {
    const { language } = useLanguage();
    const title = language === 'hi' ? assignment.title_hi : assignment.title;

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate(e.target.value.split('\n').filter(line => line.trim() !== ''));
    };

    return (
        <div className="h-full border border-gray-400 p-2 flex flex-col text-sm bg-white">
            <h4 className="font-bold text-center border-b border-gray-400 pb-1 mb-1 shrink-0">{title}</h4>
            {isEditing ? (
                <textarea
                    value={assignment.officers.join('\n')}
                    onChange={handleTextChange}
                    className="w-full h-full flex-grow resize-none border-none focus:ring-0 p-1 m-0 bg-blue-50"
                    aria-label={`${title} officers`}
                />
            ) : (
                assignment.officers.length > 0 && (
                    <ul className="space-y-1 flex-grow overflow-y-auto">
                        {assignment.officers.map((officer, index) => (
                            <li key={index} className="break-words">{officer}</li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
};


const DutyChartPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [dutyChart, setDutyChart] = useState<DutyChartData | null>(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDutyChart, setEditedDutyChart] = useState<DutyChartData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await api.getDutyChart(user, date);
            setDutyChart(data);
            setIsLoading(false);
        };
        fetchData();
    }, [date, user]);
    
    const handleEditStart = () => {
        setEditedDutyChart(JSON.parse(JSON.stringify(dutyChart))); // Deep copy for editing
        setIsEditing(true);
    };

    const handleEditCancel = () => {
        setEditedDutyChart(null);
        setIsEditing(false);
    };

    const handleEditSave = async () => {
        if (editedDutyChart && user) {
            setIsLoading(true);
            await api.updateDutyChart(user, date, editedDutyChart);
            setDutyChart(editedDutyChart);
            setIsEditing(false);
            setEditedDutyChart(null);
            setIsLoading(false);
        }
    };

    const handleAssignmentUpdate = (title: string, newOfficers: string[]) => {
        setEditedDutyChart(prevChart => {
            if (!prevChart) return null;
            
            const newAssignments = prevChart.assignments.map(assign => {
                if (assign.title === title) {
                    return { ...assign, officers: newOfficers };
                }
                return assign;
            });

            return { ...prevChart, assignments: newAssignments };
        });
    };

    const displayChart = isEditing ? editedDutyChart : dutyChart;

    if (isLoading) {
        return <div>Loading duty chart...</div>;
    }

    if (!displayChart) {
        return <div>No duty chart data available for this date.</div>;
    }

    const assignmentCards = displayChart.assignments.map(assignment => ({
      content: assignment,
      span: 2 + assignment.officers.length, // Base height + 1 row per officer
    }));

    const col1Assignments: typeof assignmentCards = [];
    const col2Assignments: typeof assignmentCards = [];
    let col1Height = 0;
    let col2Height = 0;

    assignmentCards.forEach(card => {
        if (col1Height <= col2Height) {
            col1Assignments.push(card);
            col1Height += card.span;
        } else {
            col2Assignments.push(card);
            col2Height += card.span;
        }
    });

    const gridRowCount = Math.max(displayChart.personnel.length, col1Height, col2Height) + 1;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <label htmlFor="duty-date" className="font-semibold mr-2">{t('date')}:</label>
                    <input 
                        type="date" 
                        id="duty-date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border border-gray-300 rounded-md p-1"
                        disabled={isEditing}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleEditSave} className="flex items-center bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors">
                                <Save size={16} className="mr-2" /> {t('saveChanges')}
                            </button>
                            <button onClick={handleEditCancel} className="flex items-center bg-gray-500 text-white px-3 py-1.5 rounded-md hover:bg-gray-600 transition-colors">
                                <X size={16} className="mr-2" /> {t('cancel')}
                            </button>
                        </>
                    ) : (
                        <button onClick={handleEditStart} className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors">
                            <Edit size={16} className="mr-2" /> {t('edit')}
                        </button>
                    )}
                </div>
            </div>
            
            <div>
                <div className="text-center mb-2">
                    <h2 className="text-xl font-bold">
                        {t('dutyChartTitle', { station: user?.stationName || 'N/A', district: 'अजमेर' })}
                    </h2>
                    <p className="font-bold">{t('date')}: {new Date(date).toLocaleDateString('hi-IN')}</p>
                </div>
                
                <div 
                  className="grid border-t border-l border-black"
                  style={{
                    gridTemplateColumns: 'auto auto auto auto 1fr 1fr',
                    gridTemplateRows: `auto repeat(${gridRowCount -1}, auto)`,
                    fontSize: '13px'
                  }}
                >
                  {/* Headers */}
                  <div className="font-bold bg-gray-200 p-1 border-b border-r border-black">{t('sno')}</div>
                  <div className="font-bold bg-gray-200 p-1 border-b border-r border-black">{t('personnelName')}</div>
                  <div className="font-bold bg-gray-200 p-1 border-b border-r border-black">{t('designation')}</div>
                  <div className="font-bold bg-gray-200 p-1 border-b border-r border-black">{t('details')}</div>
                  <div className="font-bold bg-gray-200 p-1 border-b border-r border-black text-center" style={{ gridColumn: 'span 2' }}>{t('dutyDetails')}</div>

                  {/* Personnel Data */}
                  {displayChart.personnel.map((p, index) => (
                      <React.Fragment key={p.sno}>
                          <div style={{ gridRow: index + 2, gridColumn: 1 }} className="p-1 border-b border-r border-black text-center">{p.sno}</div>
                          <div style={{ gridRow: index + 2, gridColumn: 2 }} className="p-1 border-b border-r border-black">{p.name}</div>
                          <div style={{ gridRow: index + 2, gridColumn: 3 }} className="p-1 border-b border-r border-black">{p.designation}</div>
                          <div style={{ gridRow: index + 2, gridColumn: 4 }} className="p-1 border-b border-r border-black flex justify-between">
                            <span>{p.details}</span>
                            <span className="font-bold">{p.presence}</span>
                          </div>
                      </React.Fragment>
                  ))}

                  {/* Assignments Column 1 */}
                  {(() => {
                      let currentRow = 2;
                      return col1Assignments.map((block, index) => {
                          const startRow = currentRow;
                          currentRow += block.span;
                          return (
                              <div key={`col1-${index}`} className="p-0 border-b border-r border-black" style={{ gridColumn: 5, gridRow: `${startRow} / span ${block.span}` }}>
                                  <DutyAssignmentCard
                                      assignment={block.content}
                                      isEditing={isEditing}
                                      onUpdate={(newOfficers) => handleAssignmentUpdate(block.content.title, newOfficers)}
                                  />
                              </div>
                          );
                      });
                  })()}

                  {/* Assignments Column 2 */}
                   {(() => {
                      let currentRow = 2;
                      return col2Assignments.map((block, index) => {
                          const startRow = currentRow;
                          currentRow += block.span;
                          return (
                              <div key={`col2-${index}`} className="p-0 border-b border-r border-black" style={{ gridColumn: 6, gridRow: `${startRow} / span ${block.span}` }}>
                                  <DutyAssignmentCard
                                    assignment={block.content}
                                    isEditing={isEditing}
                                    onUpdate={(newOfficers) => handleAssignmentUpdate(block.content.title, newOfficers)}
                                  />
                              </div>
                          );
                      });
                  })()}
                </div>

                <div className="mt-2">
                     <table className="border-collapse border border-black text-sm">
                        <tbody>
                            <tr>
                                <td className="border border-black px-2 py-1 font-bold">{t('totalPresent')}</td>
                                <td className="border border-black px-2 py-1 text-center">{displayChart.summary.present}</td>
                                <td className="border border-black px-2 py-1 font-bold">{t('onLeave')}</td>
                                <td className="border border-black px-2 py-1 text-center">{displayChart.summary.on_leave}</td>
                                <td className="border border-black px-2 py-1 font-bold">{t('absent')}</td>
                                <td className="border border-black px-2 py-1 text-center">{displayChart.summary.absent}</td>
                                <td className="border border-black px-2 py-1 font-bold">{t('outstation')}</td>
                                <td className="border border-black px-2 py-1 text-center">{displayChart.summary.outstation_duty}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default DutyChartPage;