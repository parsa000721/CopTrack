
// FIX: Import missing Duty Chart types.
import { DutyChartData, DutyRow, DutyPersonnel, DutyAssignment } from '../types';

const dutyChartRows: DutyRow[] = [
  {
    personnel: { sno: 1, name: 'श्री विक्रम सिंह', designation: 'पुलिस निरीक्षक', details: 'SHO', presence: 'P' },
    assignments: {
      col1: {
        content: { title: 'Upcoming DO 8.00 AM to 8.00 AM', title_hi: 'आगामी डीओ 8.00 AM से 8.00 AM', officers: ['01. श्री अमराराम सउनि', '02. श्री शेख कानि 2948', '03. श्री मानसिंह कानि. 626'] },
        span: 4
      },
      col2: {
        content: { title: 'Surveillance', title_hi: 'निगरानी', officers: ['01.श्री योगेन्द्र कानि 1955', '02.श्री रमेश कानि. 2350'] },
        span: 8
      }
    }
  },
  { personnel: { sno: 2, name: 'श्री छितरलाल', designation: 'सउनि', details: '', presence: 'P' } },
  { personnel: { sno: 3, name: 'श्री गोपालसिंह', designation: 'सउनि', details: '', presence: 'P' } },
  { personnel: { sno: 4, name: 'श्री हरबानसिंह', designation: 'सउनि', details: '', presence: 'P' } },
  {
    personnel: { sno: 5, name: 'श्री अमराराम', designation: 'सउनि', details: '', presence: 'P' },
    assignments: {
      col1: {
        content: { title: 'Evening Patrol', title_hi: 'सायंकालीन पैदल गश्त', officers: ['01.श्रीमान थानाधिकारी महोदय', '02.श्री अजीत सिंह हैडकानि 1984', '03.श्री गजेन्द्र कानि 2423', '04.श्री अमित कानि. 2972', '05. श्री सुनील कानि 2035'] },
        span: 13
      }
    }
  },
  { personnel: { sno: 6, name: 'श्री अजीत सिंह', designation: 'हैडकानि 1438', details: '', presence: 'P' } },
  { personnel: { sno: 7, name: 'श्री हबीब खां', designation: 'हैडकानि 1984', details: '', presence: 'P' } },
  { personnel: { sno: 8, name: 'श्री रामस्वरूप', designation: 'हैडकानि 1611', details: 'HM force', presence: 'P' } },
  {
    personnel: { sno: 9, name: 'श्री हीरालाल', designation: 'हैडकानि 1310', details: 'HM/M', presence: 'A' },
    assignments: {
      col2: {
        content: { title: 'Night LC', title_hi: 'रात्रि एलसी', officers: ['श्री सुरेन्द्र कानि. 1017'] },
        span: 8
      }
    }
  },
  { personnel: { sno: 10, name: 'श्री अमित', designation: 'कानि 755', details: 'आसुचना', presence: 'P' } },
  { personnel: { sno: 11, name: 'श्री प्रेमाराम', designation: 'कानि 3146', details: 'आसुचना', presence: 'P' } },
  { personnel: { sno: 12, name: 'श्री सहीराम', designation: 'कानि. 1359', details: 'Crime LC', presence: 'D' } },
  { personnel: { sno: 13, name: 'श्री रामनिवास', designation: 'कानि 1919', details: 'M/LC', presence: 'P' } },
  { personnel: { sno: 14, name: 'श्री ओमा राम', designation: 'कानि 2859', details: 'CCTNS LC', presence: 'P' } },
  { personnel: { sno: 15, name: 'श्री हरेन्द्र', designation: 'कानि 2209', details: 'S/W LC', presence: 'D' } },
  { personnel: { sno: 16, name: 'श्री परसाराम', designation: 'कानि 721', details: 'WIN./LC', presence: 'D' } },
  { personnel: { sno: 17, name: 'श्री शिवकरण', designation: 'कानि 1149', details: 'Court LC', presence: 'D' } },
  {
    personnel: { sno: 18, name: 'श्री अशोक', designation: 'कानि 3237', details: 'SHO/LC', presence: 'P' },
    assignments: {
      col1: { content: { title: 'Leave', title_hi: 'सीएल/पीएल अवकाश', officers: [] }, span: 10 },
      col2: { content: { title: 'Absent', title_hi: 'गैर हाजिर', officers: ['01. श्री हीरालाल 1310', '02. श्री हेमाराम कानि 2101', '03. श्रीमति संतोष मकानि 1921', '04. श्री सुरेन्द्र कानि 2836', '05. श्री कैलाश कानि 2328'] }, span: 10 }
    }
  },
  { personnel: { sno: 19, name: 'श्री सुखवीर', designation: 'कानि 640', details: 'IO/LC', presence: 'P' } },
  { personnel: { sno: 20, name: 'श्री हरिराम', designation: 'कानि 2398', details: 'IO/LC', presence: 'P' } },
  { personnel: { sno: 21, name: 'श्री सुरेन्द्र', designation: 'कानि 2836', details: 'IO/LC', presence: 'A' } },
  { personnel: { sno: 22, name: 'श्री जितेन्द्र', designation: 'कानि 2006', details: '', presence: 'P' } },
  { personnel: { sno: 23, name: 'श्री गुलशन', designation: 'कानि 3175', details: '', presence: 'P' } },
  { personnel: { sno: 24, name: 'श्री जगदीश', designation: 'कानि 2415', details: '', presence: 'P' } },
  { personnel: { sno: 25, name: 'श्री अमित', designation: 'कानि 2972', details: '', presence: 'P' } },
  { personnel: { sno: 26, name: 'श्री हेमाराम', designation: 'कानि 2101', details: '', presence: 'A' } },
  { personnel: { sno: 27, name: 'श्री पूरण', designation: 'कानि 660', details: '', presence: 'P' } },
  {
    personnel: { sno: 28, name: 'श्री भोजराज', designation: 'कानि 862', details: '', presence: 'P' },
    assignments: {
      col1: { content: { title: 'Mail Duty', title_hi: 'डाक ड्यूटी', officers: ['श्री रिछपाल कानि 2613'] }, span: 6 },
      col2: { content: { title: 'Outstation Duty', title_hi: 'बाहर ड्यूटी', officers: ['श्री शिवकरण कानि 1149', 'श्री देवेन्द्र कानि 1243'] }, span: 8 }
    }
  },
  { personnel: { sno: 29, name: 'श्री सुरेन्द्र', designation: 'कानि. 1017', details: '', presence: 'P' } },
  { personnel: { sno: 30, name: 'श्री देवेन्द्र', designation: 'कानि 1243', details: '', presence: 'P' } },
  { personnel: { sno: 31, name: 'श्री नरसाराम', designation: 'कानि 1530', details: '', presence: 'P' } },
  { personnel: { sno: 32, name: 'श्री धर्मपाल', designation: 'कानि 1714', details: '', presence: 'P' } },
  { personnel: { sno: 33, name: 'श्री रिछपाल', designation: 'कानि 2613', details: '', presence: 'P' } },
  {
    personnel: { sno: 34, name: 'श्री गजेन्द्र राम', designation: 'कानि 2423', details: '', presence: 'P' },
    assignments: {
// FIX: Added missing 'title_hi' property to match DutyAssignment type.
      col1: { content: { title: 'Reserve', title_hi: 'बचत', subtext: 'withNightDO', subtext_hi: 'रात्रि डीओ के साथ-', officers: ['श्री श्रवण कानि 1503'] }, span: 8 }
    }
  },
  { personnel: { sno: 35, name: 'श्री कैलाश', designation: 'कानि 2328', details: '', presence: 'A' } },
  {
    personnel: { sno: 36, name: 'श्री रामदेव', designation: 'कानि 2399', details: '', presence: 'D' },
    assignments: {
      col2: { content: { title: 'Night Sigma', title_hi: 'रात्रि सिग्मा', officers: ['श्री धर्मपाल कानि. 1714', 'श्री प्रधान कानि 486'] }, span: 6 }
    }
  },
  { personnel: { sno: 37, name: 'श्रीमती संतोष', designation: 'मकानि 1921', details: '', presence: 'A' } },
  { personnel: { sno: 38, name: 'सुश्री सुमन', designation: 'मकानि 1770', details: 'P/LC', presence: 'P' } },
  { personnel: { sno: 39, name: 'श्रीमती सुनीता', designation: 'मकानि 2303', details: 'CS/FR', presence: 'P' } },
  { personnel: { sno: 40, name: 'श्री मानसिंह', designation: 'कानि. 626', details: 'Driver', presence: 'P' } },
  {
    personnel: { sno: 41, name: 'श्री सुनील', designation: 'कानि 2035', details: 'Driver', presence: 'P' },
    assignments: {
        col2: { content: { title: 'Tomorrow Day Sigma', title_hi: 'कल दिन सिग्मा', officers: ['श्री पूरणमल कानि. 680'] }, span: 1 }
    }
  }
];

// FIX: Transformed the old 'rows' structure into 'personnel' and 'assignments' arrays to match the DutyChartData type.
const personnel: DutyPersonnel[] = dutyChartRows.map(row => row.personnel);
const assignments: DutyAssignment[] = [];
dutyChartRows.forEach(row => {
    if (row.assignments?.col1) {
        assignments.push(row.assignments.col1.content);
    }
    if (row.assignments?.col2) {
        assignments.push(row.assignments.col2.content);
    }
});

export const dutyChartData: DutyChartData = {
  date: '23.10.2025',
  personnel,
  assignments,
  summary: {
    present: 34,
    on_leave: 0,
    absent: 5,
    outstation_duty: 2,
  },
};
