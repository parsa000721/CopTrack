
export interface CrimeHead {
  id: string;
  s_n: string;
  sub_crime_code: string;
  name: string;
  name_hi: string;
  category_id: string;
  is_total?: boolean;
  parent_code?: string | null;
}


export const emcrCrimeHeads: CrimeHead[] = [
  // --- भारतीय दण्ड संहिता ---
  { id: 'ipc_heading', s_n: '1', sub_crime_code: '', name: 'Indian Penal Code', name_hi: 'भारतीय दण्ड संहिता', category_id: 'ipc', is_total: true, parent_code: null },
  { id: 'murder', s_n: '2', sub_crime_code: '1', name: 'Murder (302/303 IPC)', name_hi: 'हत्या (302/303 भा.द.सं.)', category_id: 'murder', parent_code: 'ipc_heading' },
  { id: 'murder_profit', s_n: '3', sub_crime_code: '1.1', name: 'For Profit', name_hi: 'लाभ हेतु', category_id: 'murder', parent_code: 'murder_total' },
  { id: 'murder_property_dispute', s_n: '4', sub_crime_code: '1.2', name: 'Property Dispute', name_hi: 'सम्पति (चल व अचल) संबंधी विवाद के कारण', category_id: 'murder', parent_code: 'murder_total' },
  { id: 'murder_personal_enmity', s_n: '5', sub_crime_code: '1.3', name: 'Personal/Family Enmity', name_hi: 'व्यक्तिगत अथवा खानदानी दुशमनी के कारण', category_id: 'murder', parent_code: 'murder_total' },
  { id: 'murder_dowry', s_n: '6', sub_crime_code: '1.4', name: 'For Dowry', name_hi: 'दहेज के कारण', category_id: 'murder', parent_code: 'murder_total' },
  // ... (Adding all sub-categories for Murder)
  { id: 'murder_total', s_n: '26', sub_crime_code: '', name: 'Total Murder', name_hi: 'कुल हत्या', category_id: 'murder', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },
  
  { id: 'attempt_to_murder', s_n: '27', sub_crime_code: '2', name: 'Attempt to Murder (307 IPC)', name_hi: 'हत्या का प्रयास (307 भा. द. सं.)', category_id: 'attempt_to_murder', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },

  { id: 'culpable_homicide', s_n: '28', sub_crime_code: '3', name: 'Culpable Homicide (304 IPC)', name_hi: 'गैर इरादतन हत्या (धारा 304 IPC)', category_id: 'culpable_homicide', parent_code: 'ipc_heading' },
  // ... (Sub-categories for 304)
  { id: 'culpable_homicide_total', s_n: '52', sub_crime_code: '', name: 'Total Culpable Homicide', name_hi: 'कुल गैरइरादतन हत्या', category_id: 'culpable_homicide', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },
  
  { id: 'attempt_culpable_homicide', s_n: '53', sub_crime_code: '4', name: 'Attempt to Commit Culpable Homicide (308 IPC)', name_hi: 'गैर इरादतन हत्या के लिए प्रतिबद्ध करने के प्रयास(308 IPC)', category_id: 'attempt_culpable_homicide', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },

  { id: 'rape', s_n: '54', sub_crime_code: '5', name: 'Rape (376 IPC)', name_hi: 'बलात्कार (376 भा. द. सं.)', category_id: 'rape', parent_code: 'ipc_heading' },
  // ... (Sub-categories for Rape)
  { id: 'rape_total', s_n: '59', sub_crime_code: '', name: 'Total Rape', name_hi: 'कुल बलात्कार', category_id: 'rape', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },
  
  { id: 'attempt_to_rape', s_n: '60', sub_crime_code: '6', name: 'Attempt to Rape (376/511 IPC)', name_hi: 'बलात्कार करने के लिए प्रयास (धारा 376 /511 IPC)', category_id: 'attempt_to_rape', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },

  { id: 'kidnapping', s_n: '61', sub_crime_code: '7', name: 'Kidnapping & Abduction (363-369 IPC)', name_hi: 'व्‍यपहरण / अपहरण (363 से 369 भा. द. सं.)', category_id: 'kidnapping', parent_code: 'ipc_heading' },
  // ... (Sub-categories for Kidnapping)
  { id: 'kidnapping_total', s_n: '67', sub_crime_code: '', name: 'Total Kidnapping & Abduction', name_hi: 'कुल व्‍यपहरण / अपहरण', category_id: 'kidnapping', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },

  { id: 'dacoity', s_n: '68', sub_crime_code: '8', name: 'Dacoity (395-398 IPC)', name_hi: 'डकैती (395 से 398 भा. द. सं.)', category_id: 'dacoity', parent_code: 'ipc_heading' },
  // ... (Sub-categories for Dacoity)
  { id: 'dacoity_total', s_n: '77', sub_crime_code: '', name: 'Total Dacoity', name_hi: 'कुल डकैती', category_id: 'dacoity', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },

  { id: 'dacoity_prep', s_n: '78', sub_crime_code: '9', name: 'Preparation for Dacoity (399/402 IPC)', name_hi: 'डकैती करने के लिए तैयारी करना एवं एकत्रित होना(399 व 402)', category_id: 'dacoity_prep', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },

  { id: 'robbery', s_n: '79', sub_crime_code: '10', name: 'Robbery (392-394, 397/398 IPC)', name_hi: 'लूट (392 से 394, 397/398 भा. द. सं.)', category_id: 'robbery', parent_code: 'ipc_heading' },
   // ... (Sub-categories for Robbery)
  { id: 'robbery_total', s_n: '87', sub_crime_code: '', name: 'Total Robbery', name_hi: 'कुल लूट', category_id: 'robbery', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },

  { id: 'burglary', s_n: '88', sub_crime_code: '11', name: 'Burglary (453-460, 380 IPC)', name_hi: 'नकबजनी (453 से 460 भा.द.सं. , 380 भा. द. सं.के साथ पठित)', category_id: 'burglary', parent_code: 'ipc_heading' },
   // ... (Sub-categories for Burglary)
  { id: 'burglary_total', s_n: '96', sub_crime_code: '', name: 'Total Burglary', name_hi: 'कुल नकबजनी', category_id: 'burglary', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },

  { id: 'theft', s_n: '97', sub_crime_code: '12', name: 'Theft (379-382 IPC)', name_hi: 'चोरी ( 379 से 382 भा. द. सं.)', category_id: 'theft', parent_code: 'ipc_heading' },
   // ... (Sub-categories for Theft)
  { id: 'theft_total', s_n: '112', sub_crime_code: '', name: 'Total Theft', name_hi: 'कुल चोरी', category_id: 'theft', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },
  
  { id: 'riot_unlawful_assembly', s_n: '113', sub_crime_code: '13', name: 'Unlawful Assembly (143-145 IPC)', name_hi: 'विधि विरूद्ध जमाव (143 से 145 भा. द. सं. )', category_id: 'riot', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },
  
  { id: 'riot', s_n: '114', sub_crime_code: '14', name: 'Rioting (147-151, 153A IPC)', name_hi: 'बलवा (147 से 151 व 153A भा. द. सं.)', category_id: 'riot', parent_code: 'ipc_heading' },
   // ... (Sub-categories for Riot)
  { id: 'riot_total', s_n: '124', sub_crime_code: '', name: 'Total Rioting', name_hi: 'कुल बलवा', category_id: 'riot', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },

  // ... (Continue for all IPC crimes)
  { id: 'other_ipc', s_n: '180', sub_crime_code: '39', name: 'Other IPC Crimes', name_hi: 'अन्य भा. द. सं. अपराध', category_id: 'other_ipc', is_total: true, parent_code: 'total_ipc_bhartiya_dand_sanhita' },

  { id: 'total_ipc_bhartiya_dand_sanhita', s_n: '181', sub_crime_code: '', name: 'Total IPC', name_hi: 'भारतीय दण्ड संहिता- योग', category_id: 'ipc', is_total: true, parent_code: null },
  
  // --- स्थानीय एवं विशेष अधिनियम ---
  { id: 'sll_heading', s_n: '182', sub_crime_code: '', name: 'Local & Special Laws', name_hi: 'स्थानीय एवं विशेष अधिनियम', category_id: 'sll', is_total: true, parent_code: null },
  { id: 'arms_act', s_n: '183', sub_crime_code: '1', name: 'Arms Act, 1959', name_hi: 'आर्म्‍स एक्‍ट, 1959', category_id: 'sll', is_total: true, parent_code: 'total_sll' },
  { id: 'ndps_act', s_n: '184', sub_crime_code: '2', name: 'NDPS Act, 1985', name_hi: 'एन.डी.पी.एस. एक्‍ट,1985', category_id: 'sll', is_total: true, parent_code: 'total_sll' },
  // ... (Continue for all SLL crimes)
  { id: 'other_sll', s_n: '259', sub_crime_code: '60', name: 'Other Local & Special Laws', name_hi: 'अन्य स्थानीय एवं विशेष अधिनियम (उपरोक्त मदों के अलावा)', category_id: 'sll', is_total: true, parent_code: 'total_sll' },
  { id: 'total_sll', s_n: '260', sub_crime_code: '', name: 'Total SLL', name_hi: 'स्थानीय एवं विशेष अधिनियम- योग', category_id: 'sll', is_total: true, parent_code: null },
];
