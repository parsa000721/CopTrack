import React, { Fragment } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ComparativeReport } from '../types';

interface ComparativeTableProps {
  report: ComparativeReport;
  stationName: string;
  month: string;
  year: number;
}

const ComparativeTable: React.FC<ComparativeTableProps> = ({ report, stationName, month, year }) => {
    const { language, t } = useLanguage();
    const title = language === 'hi' ? report.title_hi : report.title;
    
    const renderCell = (data: any, key: string) => {
        const value = data[key];
        if (value === undefined || value === null) return '-';
        return String(value);
    }

    const renderItemGroup = (itemGroup: any, index: number) => {
        const titleCell = (
            <td rowSpan={3} className="border border-gray-300 px-2 py-1 align-middle text-center">
                {language === 'hi' ? itemGroup.title_hi : itemGroup.title}
            </td>
        );

        const snoCell = (
            <td rowSpan={3} className="border border-gray-300 px-2 py-1 align-middle text-center">
                {index + 1}
            </td>
        );

        return itemGroup.data.map((row: any, rowIndex: number) => (
            <tr key={`${itemGroup.id}-${row.year}`} className="even:bg-gray-50">
                {rowIndex === 0 && snoCell}
                {rowIndex === 0 && titleCell}
                {report.headers.filter(h => !h.isSNo && !h.isTitle).map(header => (
                     <td key={header.key} className="border border-gray-300 px-2 py-1 text-center">
                        {renderCell(row, header.key)}
                    </td>
                ))}
            </tr>
        ));
    };
    
    const renderTotals = (totalsGroup: any) => {
         const titleCell = (
            <td colSpan={2} rowSpan={3} className="border border-gray-300 px-2 py-1 align-middle text-center">
                {language === 'hi' ? totalsGroup.title_hi : totalsGroup.title}
            </td>
        );

        return totalsGroup.data.map((row: any, rowIndex: number) => (
            <tr key={`total-${row.year}`}>
                {rowIndex === 0 && titleCell}
                {report.headers.filter(h => !h.isSNo && !h.isTitle).map(header => (
                     <td key={header.key} className="border border-gray-300 px-2 py-1 text-center">
                        {renderCell(row, header.key)}
                    </td>
                ))}
            </tr>
        ));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
            <div className="mb-2 text-center font-bold text-lg">
                {t('comparativeReportTitle', { title })}
            </div>
            <div className="flex justify-between mb-2 text-sm font-semibold">
                <span>{t('policeStation')}/{t('circle')}: {stationName}</span>
                <span>{t('month')}: {month}</span>
                <span>{year}</span>
            </div>
            <table className="w-full border-collapse border border-gray-400 text-sm">
                <thead className="bg-gray-200">
                    <tr>
                        {report.headers.map(header => (
                            <th key={header.key} className="border border-gray-300 px-2 py-1 font-bold">
                                {language === 'hi' ? header.label_hi : header.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {report.itemGroups.map((group, index) => (
                        <Fragment key={group.id}>
                           {renderItemGroup(group, index)}
                        </Fragment>
                    ))}
                </tbody>
                <tfoot className="bg-gray-200 font-bold border-t-2 border-gray-400">
                    {renderTotals(report.totalsGroup)}
                </tfoot>
            </table>
        </div>
    );
};

export default ComparativeTable;