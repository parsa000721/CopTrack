import { Role, User, Register, RegisterField, FieldType, RecordData, PoliceStation, DutyChartData, ChatMessage, Notification, NotificationType } from '../types';
// FIX: Import initial duty chart data to be used in the new getDutyChart function.
import { dutyChartData as initialDutyChartData } from './dutyData';

const DB_PREFIX = 'police_rms_';

// These functions will remain to interact with localStorage as the persistence layer.
const dbGet = <T>(key: string, defaultValue: T): T => {
    try {
        const value = localStorage.getItem(`${DB_PREFIX}${key}`);
        return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
        console.error(`Error getting ${key} from localStorage`, e);
        return defaultValue;
    }
};

const dbSet = (key: string, value: any) => {
    try {
        localStorage.setItem(`${DB_PREFIX}${key}`, JSON.stringify(value));
    } catch (e) {
        console.error(`Error setting ${key} in localStorage`, e);
    }
};

// --- SIMULATED IN-MEMORY DATABASE ---
// This object holds the application's entire state. It's loaded from localStorage
// on startup. In a real application with a backend, this object would not exist,
// and functions would make API calls instead of modifying it directly.
const database = {
    stations: [] as PoliceStation[],
    users: [] as User[],
    passwords: {} as Record<string, string>,
    records: [] as RecordData[],
    activity_logs: [] as any[],
    chat_messages: [] as ChatMessage[],
    notifications: [] as Notification[],
};

/**
 * Persists the entire in-memory `database` object to localStorage.
 * FOR CROSS-DEVICE SYNC: This function should be replaced. Instead of writing
 * to localStorage, individual functions (like `addRecord`, `updateUser`) should
 * make `fetch` calls to a backend API to persist their changes to a central database.
 */
const persistDatabase = () => {
    dbSet('stations', database.stations);
    dbSet('users', database.users);
    dbSet('passwords', database.passwords);
    dbSet('records', database.records);
    dbSet('activity_logs', database.activity_logs);
    dbSet('chat_messages', database.chat_messages);
    dbSet('notifications', database.notifications);
};


// --- REGISTERS DEFINITION ---
export const registers: Register[] = [
    {
        id: 'crime_register',
        name: 'Crime Register',
        name_hi: 'अपराध रजिस्टर',
        fields: [
            { id: 'caseNumber', label: 'Case Number', label_hi: 'अपराध क्रमांक', type: FieldType.TEXT, required: true },
            { id: 'dateRegistered', label: 'Date Registered', label_hi: 'दर्ज दिनांक', type: FieldType.DATE, required: true },
            { id: 'section', label: 'Section', label_hi: 'धारा', type: FieldType.TEXT, required: true },
            { id: 'complainant', label: 'Complainant Name & Address', label_hi: 'परिवादी का नाम व पता', type: FieldType.TEXTAREA, required: true },
            { id: 'incidentLocation', label: 'Incident Location/Date', label_hi: 'घटना स्थल/दिनांक', type: FieldType.TEXT, required: true },
            { id: 'caseDetails', label: 'Brief Case Details', label_hi: 'संक्षिप्त विवरण', type: FieldType.TEXTAREA, required: true },
            { id: 'investigatingOfficer', label: 'Investigating Officer', label_hi: 'अनुसंधान अधिकारी', type: FieldType.TEXT, required: true },
            { id: 'accused', label: 'Accused Name & Address', label_hi: 'अभियुक्त का नाम व पता', type: FieldType.TEXTAREA, required: false },
            { id: 'disposal_type', label: 'Disposal Type', label_hi: 'निस्तारण प्रकार', type: FieldType.SELECT, required: true, 
              options: ['Pending', '157-B', 'Adam Vaku (Jhooth)', 'Adam Vaku (Anya)', 'Adam Pata', 'Adam Saboot', '299 CrPC', 'Challan'], 
              options_hi: ['लम्बित', '157-बी', 'अदम वकू (झूठ)', 'अदम वकू (अन्य)', 'अदम पता', 'अदम सबूत', '299 द.प्र.सं', 'चालान'] 
            },
            { id: 'result', label: 'Result/Court Decision', label_hi: 'परिणाम/न्यायालय निर्णय', type: FieldType.TEXTAREA, required: false },
            { id: 'arrested_male', label: 'Arrested (Male)', label_hi: 'गिरफ्तार (पुरुष)', type: FieldType.NUMBER, required: false },
            { id: 'arrested_female', label: 'Arrested (Female)', label_hi: 'गिरफ्तार (महिला)', type: FieldType.NUMBER, required: false },
            { id: 'stolen_property_value', label: 'Value of Stolen Property', label_hi: 'माल मसरूखा', type: FieldType.NUMBER, required: false },
            { id: 'recovered_property_value', label: 'Value of Recovered Property', label_hi: 'माल बरामद', type: FieldType.NUMBER, required: false },
        ]
    },
    {
        id: 'insadadi_register',
        name: 'Insadadi Register (Preventive Action)',
        name_hi: 'इंसदादी रजिस्टर (निरोधात्मक कार्यवाही)',
        fields: [
             {
                id: 'month',
                label: 'Month',
                label_hi: 'माह',
                type: FieldType.SELECT,
                required: true,
                options: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                options_hi: ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
            },
            {
                id: 'actionTitle',
                label: 'Preventive Action Title',
                label_hi: 'निरोधात्मक कार्यवाही शीर्षक',
                type: FieldType.TEXT,
                required: true,
            },
            { id: 'monthIstgasa', label: 'Month Istgasa', label_hi: 'माह इस्तगासा', type: FieldType.NUMBER, required: true },
            { id: 'monthPaband', label: 'Persons Restricted in Month', label_hi: 'माह में पाबंद व्यक्ति', type: FieldType.NUMBER, required: true },
            { id: 'yearIstgasa', label: 'Year Istgasa', label_hi: 'वर्ष में इस्तगासा', type: FieldType.NUMBER, required: true },
            { id: 'yearPaband', label: 'Persons Restricted in Year', label_hi: 'वर्ष में पाबंद व्यक्ति', type: FieldType.NUMBER, required: true },
        ]
    },
    {
        id: 'malkhana_register',
        name: 'Malkhana Register',
        name_hi: 'मालखाना रजिस्टर',
        fields: [
            { id: 'caseNumber', label: 'Case Number', label_hi: 'अपराध क्रमांक', type: FieldType.TEXT, required: true },
            { id: 'itemNumber', label: 'Item Number', label_hi: 'आइटम नंबर', type: FieldType.TEXT, required: true },
            { id: 'itemDescription', label: 'Item Description', label_hi: 'आइटम का विवरण', type: FieldType.TEXTAREA, required: true },
            { id: 'dateReceived', label: 'Date of Receipt', label_hi: 'प्राप्ति की दिनांक', type: FieldType.DATE, required: true },
            { id: 'investigatingOfficer', label: 'Investigating Officer', label_hi: 'अनुसंधान अधिकारी', type: FieldType.TEXT, required: true },
            { id: 'sentToFSLDate', label: 'Date Sent to FSL', label_hi: 'एफएसएल भेजने की दिनांक', type: FieldType.DATE, required: false },
            { id: 'receivedFromFSLDate', label: 'Date Received from FSL', label_hi: 'एफएसएल से प्राप्ति की दिनांक', type: FieldType.DATE, required: false },
            { id: 'handoverDate', label: 'Date of Handover', label_hi: 'सुपुर्दगी की दिनांक', type: FieldType.DATE, required: false },
        ]
    },
    {
        id: 'index_register',
        name: 'Index Register',
        name_hi: 'इंडेक्स रजिस्टर',
        fields: [
            { id: 'indexPageNumber', label: 'Index Page No.', label_hi: 'इंडेक्स पृष्ठ संख्या', type: FieldType.TEXT, required: true },
            { id: 'accusedName', label: 'Accused Name', label_hi: 'अभियुक्त का नाम', type: FieldType.TEXT, required: true },
            { id: 'fatherName', label: 'Father\'s Name', label_hi: 'पिता का नाम', type: FieldType.TEXT, required: true },
            { id: 'address', label: 'Address', label_hi: 'पता', type: FieldType.TEXTAREA, required: true },
            { id: 'caseDetails', label: 'Case Details (No, Date, Section, PS)', label_hi: 'केस विवरण (नं, दिनांक, धारा, थाना)', type: FieldType.TEXTAREA, required: true },
            { id: 'result', label: 'Result/Court Decision', label_hi: 'परिणाम/न्यायालय निर्णय', type: FieldType.TEXT, required: false },
        ]
    },
     {
        id: 'posting_list',
        name: 'Posting List',
        name_hi: 'तैनाती सूची',
        fields: [
            { id: 'officerName', label: 'Officer/Staff Name', label_hi: 'अधिकारी/कर्मचारी का नाम', type: FieldType.TEXT, required: true },
            { id: 'fatherName', label: 'Father\'s Name', label_hi: 'पिता का नाम', type: FieldType.TEXT, required: false },
            { id: 'address', label: 'Address', label_hi: 'पता', type: FieldType.TEXTAREA, required: true },
            { id: 'orderNumberDate', label: 'Order No. & Date', label_hi: 'आदेश क्रमांक एवं दिनांक', type: FieldType.TEXT, required: true },
            { id: 'mobileNumber', label: 'Mobile Number', label_hi: 'मोबाइल नंबर', type: FieldType.TEXT, required: true },
            { id: 'ssoId', label: 'SSO ID', label_hi: 'एसएसओ आईडी', type: FieldType.TEXT, required: true },
            { id: 'otherDetails', label: 'Other Details', label_hi: 'अन्य विवरण', type: FieldType.TEXTAREA, required: false },
        ]
    },
    {
        id: 'permanent_warranty_list',
        name: 'Permanent Warranty List',
        name_hi: 'स्थाई वारंटी सूची',
        fields: [
            { id: 'warranteeName', label: 'Warrantee Name', label_hi: 'वारंटी का नाम', type: FieldType.TEXT, required: true },
            { id: 'fatherName', label: 'Father\'s Name', label_hi: 'पिता का नाम', type: FieldType.TEXT, required: false },
            { id: 'address', label: 'Address', label_hi: 'पता', type: FieldType.TEXTAREA, required: true },
            { id: 'caseNumber', label: 'Case Number', label_hi: 'अपराध क्रमांक', type: FieldType.TEXT, required: true },
            { id: 'section', label: 'Section', label_hi: 'धारा', type: FieldType.TEXT, required: true },
            { id: 'courtCaseNumber', label: 'Court Case Number', label_hi: 'न्यायालय केस नंबर', type: FieldType.TEXT, required: true },
            { id: 'courtName', label: 'Court Name', label_hi: 'न्यायालय का नाम', type: FieldType.TEXT, required: true },
        ]
    },
    {
        id: 'hs_list',
        name: 'HS List',
        name_hi: 'एचएस सूची',
        fields: [
            { id: 'hsName', label: 'HS Name', label_hi: 'एचएस का नाम', type: FieldType.TEXT, required: true },
            { id: 'fatherName', label: 'Father\'s Name', label_hi: 'पिता का नाम', type: FieldType.TEXT, required: false },
            { id: 'address', label: 'Address', label_hi: 'पता', type: FieldType.TEXTAREA, required: true },
            { id: 'crimeDetails', label: 'Crime Details (Case No, Date, Section, PS, Result)', label_hi: 'अपराध विवरण (केस नं, दिनांक, धारा, थाना, परिणाम)', type: FieldType.TEXTAREA, required: true },
        ]
    },
    {
        id: 'duty_register',
        name: 'Duty Register',
        name_hi: 'ड्यूटी रजिस्टर',
        fields: [
            { 
                id: 'officerId', 
                label: 'Officer/Staff Name', 
                label_hi: 'अधिकारी/कर्मचारी का नाम', 
                type: FieldType.SELECT, 
                required: true,
                optionsSourceRegisterId: 'posting_list',
                optionsSourceDisplayField: 'officerName',
            },
            {
                id: 'presence',
                label: 'Presence',
                label_hi: 'उपस्थिति',
                type: FieldType.SELECT,
                required: true,
                options: ['Present', 'Absent'],
                options_hi: ['हाजिर', 'गैरहाजिर']
            },
            { 
                id: 'dutyType', 
                label: 'Duty Type', 
                label_hi: 'ड्यूटी का प्रकार', 
                type: FieldType.SELECT, 
                required: true,
                options: ['General', 'Station Officer', 'Surveillance', 'Evening Patrol', 'Night LC', 'Mail Duty', 'Outstation', 'Reserve', 'Night Sigma', 'Leave', 'Absent', 'CCTN Operator', 'Window Operator', 'Investigation Assistant', 'Malkhana Assistant', 'Reader', 'Intelligence I', 'Intelligence II', 'HM Admin', 'HM Malkhana'],
                options_hi: ['सामान्य', 'थानाधिकारी', 'निगरानी', 'सायंकालीन पैदल गश्त', 'रात्रि एलसी', 'डाक ड्यूटी', 'बाहर ड्यूटी', 'बचत', 'रात्रि सिग्मा', 'अवकाश', 'गैर हाजिर', 'सीसीटीएन ऑपरेटर', 'विन्डो ऑपरेटर', 'अनुसंधान सहायक', 'मालखाना सहायक', 'रीडर', 'आसूचना प्रथम', 'आसूचना द्वितीय', 'एच.एम. प्रशासन', 'एच.एम. मालखाना']
            },
            { id: 'dutyDate', label: 'Date', label_hi: 'दिनांक', type: FieldType.DATE, required: true },
            { id: 'details', label: 'Details / Remarks', label_hi: 'विवरण / टिप्पणी', type: FieldType.TEXTAREA, required: false },
        ]
    }
];

// --- INITIAL DATA & DB INITIALIZATION ---
const initializeDatabase = () => {
    if (localStorage.getItem(`${DB_PREFIX}initialized`)) {
        // Load existing data from localStorage into the in-memory database
        database.stations = dbGet('stations', []);
        database.users = dbGet('users', []);
        database.passwords = dbGet('passwords', {});
        database.records = dbGet('records', []);
        database.activity_logs = dbGet('activity_logs', []);
        database.chat_messages = dbGet('chat_messages', []);
        database.notifications = dbGet('notifications', []);
        return;
    }

    // Seed initial data into the in-memory object
    database.stations = [
        { id: 'ps_gegal', name: 'Gegal', isActive: true },
        { id: 'ps_mangliyawas', name: 'Mangliyawas', isActive: true },
        { id: 'ps_pisangan', name: 'Pisangan', isActive: true },
        { id: 'ps_pushkar', name: 'Pushkar', isActive: true },
        { id: 'ps_dargah', name: 'Dargah', isActive: true },
        { id: 'ps_ganj', name: 'Ganj', isActive: true },
        { id: 'ps_bhinai', name: 'Bhinai', isActive: true },
        { id: 'ps_kekri_city', name: 'Kekri City', isActive: true },
        { id: 'ps_kekri_sadar', name: 'Kekri Sadar', isActive: true },
        { id: 'ps_sarana', name: 'Sarana', isActive: true },
        { id: 'ps_sarwar', name: 'Sarwar', isActive: true },
        { id: 'ps_sawar', name: 'Sawar', isActive: true },
        { id: 'ps_gandhi_nagar', name: 'Gandhi Nagar', isActive: true },
        { id: 'ps_kishangarh', name: 'Kishangarh', isActive: true },
        { id: 'ps_madanganj', name: 'Madanganj', isActive: true },
        { id: 'ps_arian', name: 'Arian', isActive: true },
        { id: 'ps_bander_sindri', name: 'Bander Sindri', isActive: true },
        { id: 'ps_borada', name: 'Borada', isActive: true },
        { id: 'ps_rupangarh', name: 'Rupangarh', isActive: true },
        { id: 'ps_nasirabad_city', name: 'Nasirabad City', isActive: true },
        { id: 'ps_nasirabad_sadar', name: 'Nasirabad Sadar', isActive: true },
        { id: 'ps_shri_nagar', name: 'Shri Nagar', isActive: true },
        { id: 'ps_christiangunj', name: 'Christiangunj', isActive: true },
        { id: 'ps_civil_lines', name: 'Civil Lines', isActive: true },
        { id: 'ps_haribhau_upadhyay_nagar', name: 'Haribhau Upadhyay Nagar', isActive: true },
        { id: 'ps_kotwali_ajmer', name: 'Kotwali Ajmer', isActive: true },
        { id: 'ps_mahila', name: 'Mahila PS', isActive: true },
        { id: 'ps_adarsh_nagar', name: 'Adrash Nagar', isActive: true },
        { id: 'ps_alwar_gate', name: 'Alwar Gate', isActive: true },
        { id: 'ps_clock_tower', name: 'Clock Tower', isActive: true },
        { id: 'ps_ramganj', name: 'Ramganj', isActive: true },
        { id: 'ps_cyber_thana_ajmer', name: 'Cyber Thana Ajmer', isActive: true },
    ];
    
    database.users = [
        { 
            id: 'admin_user', 
            name: 'Admin', 
            role: Role.ADMIN, 
            stationId: null,
            ssoId: 'rajpoliceajmer', 
            email: 'admin@rajpolice.gov',
            mobile: '1234567890',
            designation: 'System Administrator'
        },
        {
            id: 'user_insp_ram',
            name: 'Insp. Ram Singh',
            role: Role.STATION_OFFICER,
            stationId: 'ps_christiangunj',
            ssoId: 'ram.singh.insp',
            email: 'ram.singh@rajpolice.gov',
            mobile: '9876543210',
            designation: 'Inspector'
        }
    ];
    database.passwords = { 'rajpoliceajmer': 'Police@01ajmer', 'ram.singh.insp': 'password' };
    
    database.records = [
        { id: 'rec_crime_1', year: new Date().getFullYear(), stationId: 'ps_christiangunj', registerId: 'crime_register', caseNumber: `CR-001/${new Date().getFullYear()}`, dateRegistered: new Date().toISOString().split('T')[0], section: 'IPC 302', complainant: 'John Doe, Ajmer', disposal_type: 'Pending' },
        { id: 'rec_malkhana_1', year: new Date().getFullYear(), stationId: 'ps_christiangunj', registerId: 'malkhana_register', caseNumber: `CR-001/${new Date().getFullYear()}`, itemNumber: 'MK-001', itemDescription: 'A sharp knife', dateReceived: new Date().toISOString().split('T')[0] },
        { id: 'rec_posting_1', year: new Date().getFullYear(), stationId: 'ps_pushkar', registerId: 'posting_list', officerName: 'श्री विक्रम सिंह - पुनि' },
        { id: 'rec_posting_2', year: new Date().getFullYear(), stationId: 'ps_pushkar', registerId: 'posting_list', officerName: 'श्री गोपाल सिंह - सउनि' },
        { id: 'rec_posting_3', year: new Date().getFullYear(), stationId: 'ps_pushkar', registerId: 'posting_list', officerName: 'श्रीमति सुनिता - मकानि 2303' },
    ];
    
    database.activity_logs = [
        { id: 'log1', userName: 'Insp. Ram Singh', stationName: 'Christiangunj', action: 'Added new record to Crime Register', timestamp: new Date().toLocaleString() },
        { id: 'log2', userName: 'Admin', stationName: 'Admin Panel', action: 'Deactivated Jodhpur East PS', timestamp: new Date().toLocaleString() },
    ];

    database.notifications = [
        { id: 'notif1', userId: 'user_insp_ram', type: NotificationType.TASK, message: 'New task assigned: Patrol Route Update', timestamp: Date.now() - 1000 * 60 * 5, read: false },
        { id: 'notif2', userId: 'user_insp_ram', type: NotificationType.SYSTEM, message: 'System will be down for maintenance tonight at 2 AM.', timestamp: Date.now() - 1000 * 60 * 60, read: true },
    ];

    // Initial persistence to localStorage
    persistDatabase();
    localStorage.setItem(`${DB_PREFIX}initialized`, 'true');
};

initializeDatabase();


// --- API FUNCTIONS ---

export const login = async (ssoIdOrEmail: string, password: string): Promise<User | null> => {
    const user = database.users.find(u => u.ssoId === ssoIdOrEmail || u.email === ssoIdOrEmail);
    if (user && database.passwords[user.ssoId] === password) {
        if(user.role !== Role.ADMIN) {
             const station = database.stations.find(s => s.id === user.stationId);
             if(!station || !station.isActive) return null; // Prevent login if station is inactive
             user.stationName = station.name;
        }
        return user;
    }
    return null;
};

export const registerUser = async (userData: Omit<User, 'id' | 'stationId'> & { stationName: string; password: string, stationId: string | null }): Promise<User | null> => {
    if (database.users.some(u => u.ssoId === userData.ssoId || u.email === userData.email)) {
        throw new Error('User with this SSO ID or Email already exists.');
    }

    const newUser: User = {
        id: `user_${Date.now()}`,
        ...userData,
    };
    database.users.push(newUser);
    database.passwords[newUser.ssoId] = userData.password;
    
    persistDatabase();
    return newUser;
};

export const updateUserProfile = async (
    userId: string, 
    updates: Partial<Omit<User, 'id' | 'ssoId'>>, 
    passwordData: { currentPassword: string; newPassword: string }
): Promise<User> => {
    const userIndex = database.users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    const user = database.users[userIndex];

    if (passwordData.newPassword) {
        if (!passwordData.currentPassword) {
            throw new Error('Current password is required to set a new one.');
        }
        if (database.passwords[user.ssoId] !== passwordData.currentPassword) {
            throw new Error('Incorrect current password.');
        }
        database.passwords[user.ssoId] = passwordData.newPassword;
    }

    const updatedUser = { ...user, ...updates };
    database.users[userIndex] = updatedUser;
    
    if(updatedUser.role !== Role.ADMIN && !updates.stationName) {
        const station = database.stations.find(s => s.id === updatedUser.stationId);
        if (station) updatedUser.stationName = station.name;
    }

    persistDatabase();
    return updatedUser;
};

export const getAllStations = (): PoliceStation[] => {
    return database.stations;
};

export const updateStationStatus = async (stationId: string, isActive: boolean): Promise<PoliceStation> => {
    const stationIndex = database.stations.findIndex(s => s.id === stationId);
    if (stationIndex === -1) throw new Error('Station not found');

    database.stations[stationIndex].isActive = isActive;
    
    persistDatabase();
    return database.stations[stationIndex];
};

export const getAllUsers = (): User[] => {
    return database.users.map(u => ({
        ...u,
        stationName: u.stationId ? database.stations.find(s => s.id === u.stationId)?.name || 'N/A' : 'N/A (Admin)'
    }));
};

export const getRecords = async (user: User, registerId: string, year: number, filters?: { [key: string]: any }): Promise<RecordData[]> => {
    if (user.role === Role.ADMIN || !user.stationId) {
        return []; 
    }
    
    let filteredRecords = database.records.filter(r => 
        r.stationId === user.stationId && 
        r.registerId === registerId && 
        r.year === year
    );

    if (filters) {
        filteredRecords = filteredRecords.filter(record => {
            return Object.entries(filters).every(([key, value]) => record[key] === value);
        });
    }

    return filteredRecords;
};

export const getAllRecordsForRegister = async (user: User, registerId: string): Promise<RecordData[]> => {
    if (user.role === Role.ADMIN || !user.stationId) {
        return [];
    }
    return database.records.filter(r => r.stationId === user.stationId && r.registerId === registerId);
};

export const addRecord = async (user: User, registerId: string, recordData: Omit<RecordData, 'id' | 'stationId' | 'registerId'>): Promise<RecordData> => {
     if (user.role === Role.ADMIN || !user.stationId) {
        throw new Error("Admins cannot add records for a specific station.");
    }
    const newRecord: RecordData = {
        id: `rec_${Date.now()}`,
        year: recordData.year,
        ...recordData,
        stationId: user.stationId,
        registerId,
    };
    database.records.push(newRecord);
    
    persistDatabase();
    return newRecord;
};

export const updateRecord = async (user: User, registerId: string, recordId: string, recordData: RecordData): Promise<RecordData> => {
    if (user.role === Role.ADMIN || !user.stationId) {
        throw new Error("Admins cannot update records for a specific station.");
    }
    const recordIndex = database.records.findIndex(r => r.id === recordId);
    if (recordIndex === -1) throw new Error('Record not found');

    if (database.records[recordIndex].stationId !== user.stationId) {
        throw new Error("Access Denied: You cannot modify records for another station.");
    }
    
    database.records[recordIndex] = { ...database.records[recordIndex], ...recordData };
    
    persistDatabase();
    return database.records[recordIndex];
};

export const deleteRecord = async (user: User, registerId: string, recordId: string): Promise<void> => {
     if (user.role === Role.ADMIN || !user.stationId) {
        throw new Error("Admins cannot delete records for another station.");
    }
    const recordIndex = database.records.findIndex(r => r.id === recordId);
    if (recordIndex === -1) return;

    if (database.records[recordIndex].stationId !== user.stationId) {
        throw new Error("Access Denied: You cannot delete records for another station.");
    }

    database.records.splice(recordIndex, 1);
    
    persistDatabase();
};

export const getActivityLogs = (): any[] => {
    return [...database.activity_logs].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
};

// --- Reporting Functions ---
const crimeReportSectionMap: { [key: string]: string[] } = {
    murder: ['302', '303'],
    attempt_to_murder: ['307'],
    dacoity: ['395', '396', '397', '398'],
    robbery: ['392', '393', '394', '397', '398'],
    kidnapping: ['363', '364', '365', '366', '367', '368', '369'],
    rape: ['376'],
    riot: ['147', '148', '149', '150', '151', '153A'],
    burglary: ['453', '454', '455', '456', '457', '458', '459', '460', '380'],
    theft: ['379', '380', '381', '382'],
};

const crimeReportItemGroups = [
    { id: 'murder', title: 'Murder', title_hi: 'हत्या' },
    { id: 'attempt_to_murder', title: 'Attempt to Murder', title_hi: 'हत्या का प्रयास' },
    { id: 'dacoity', title: 'Dacoity', title_hi: 'डकैती' },
    { id: 'robbery', title: 'Robbery', title_hi: 'लूट' },
    { id: 'kidnapping', title: 'Kidnapping/Abduction', title_hi: 'व्यपहरण / अपहरण' },
    { id: 'rape', title: 'Rape', title_hi: 'बलात्कार' },
    { id: 'riot', title: 'Riot', title_hi: 'बल्वा' },
    { id: 'burglary', title: 'Burglary', title_hi: 'नकबजनी' },
    { id: 'theft', title: 'Theft', title_hi: 'चोरी' },
    { id: 'other_ipc', title: 'Other IPC', title_hi: 'अन्य भा.द.सं.' },
];

const sectionMatchesGroup = (sectionString: string, groupId: string): boolean => {
    const sectionsToMatch = crimeReportSectionMap[groupId];
    if (!sectionsToMatch || !sectionString) return false;
    return sectionsToMatch.some(sec => sectionString.includes(sec));
};

const isOtherIpc = (sectionString: string): boolean => {
  if (!sectionString) return false;
  for (const groupId in crimeReportSectionMap) {
      if (sectionMatchesGroup(sectionString, groupId)) {
          return false;
      }
  }
  return true;
};

export const getPendingCasesByCrimeHead = (stationId: string, year: number, month: string): { name: string, name_hi: string, pending: number }[] => {
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const monthIndex = monthNames.indexOf(month.toLowerCase());
    if (monthIndex === -1) return [];

    const crimeRecords = database.records.filter(r => {
        if (r.registerId !== 'crime_register' || r.stationId !== stationId || r.disposal_type !== 'Pending') {
            return false;
        }
        const recordDate = new Date(r.dateRegistered);
        return recordDate.getFullYear() === year && recordDate.getMonth() === monthIndex;
    });

    const summary = crimeReportItemGroups.map(group => {
        const pendingCount = crimeRecords.filter(r => {
            if (group.id === 'other_ipc') {
                return isOtherIpc(r.section);
            }
            return sectionMatchesGroup(r.section, group.id);
        }).length;
        
        return {
            name: group.title,
            name_hi: group.title_hi,
            pending: pendingCount
        };
    });

    return summary.filter(item => item.pending > 0);
};

// FIX: Implement getDutyChart to fetch duty chart data.
export const getDutyChart = async (user: User | null, date: string): Promise<DutyChartData | null> => {
    // NOTE: This function uses localStorage directly with dynamic keys.
    // For cross-device sync, this data should also be stored on a central server.
    if (!user || !user.stationId) return null;
    const key = `duty_chart_${user.stationId}_${date}`;
    const savedData = dbGet<DutyChartData | null>(key, null);
    if (savedData) {
        return savedData;
    }
    // If no data for this date, return a copy of the initial data and save it for future edits.
    const chartData = { ...initialDutyChartData, date: date };
    dbSet(key, chartData);
    return chartData;
};

// FIX: Implement updateDutyChart to save modified duty chart data.
export const updateDutyChart = async (user: User | null, date: string, data: DutyChartData): Promise<DutyChartData> => {
    // NOTE: This function uses localStorage directly with dynamic keys.
    // For cross-device sync, this data should also be stored on a central server.
    if (!user || !user.stationId) {
        throw new Error("Cannot update duty chart without a valid user and station.");
    }

    const key = `duty_chart_${user.stationId}_${date}`;
    dbSet(key, data);
    return data;
};

// --- NOTIFICATION FUNCTIONS ---
export const addNotification = async (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<Notification> => {
    const newNotification: Notification = {
        id: `notif_${Date.now()}`,
        timestamp: Date.now(),
        read: false,
        ...notificationData,
    };
    database.notifications.push(newNotification);
    
    persistDatabase();
    window.dispatchEvent(new CustomEvent('newNotification', { detail: newNotification }));
    return newNotification;
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
    return database.notifications.filter(n => n.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
};

export const markNotificationsAsRead = async (userId: string): Promise<void> => {
    let changed = false;
    database.notifications.forEach(n => {
        if (n.userId === userId && !n.read) {
            n.read = true;
            changed = true;
        }
    });
    if (changed) {
        persistDatabase();
        window.dispatchEvent(new CustomEvent('notificationsRead'));
    }
};

export const clearAllNotifications = async (userId: string): Promise<void> => {
    const originalLength = database.notifications.length;
    database.notifications = database.notifications.filter(n => n.userId !== userId);
    if (database.notifications.length < originalLength) {
        persistDatabase();
        window.dispatchEvent(new CustomEvent('notificationsCleared'));
    }
};

// --- CHAT FUNCTIONS ---

export const getChatHistory = async (userId1: string, userId2: string): Promise<ChatMessage[]> => {
    const history = database.chat_messages.filter(msg => 
        (msg.fromUserId === userId1 && msg.toUserId === userId2) ||
        (msg.fromUserId === userId2 && msg.toUserId === userId1)
    );
    return history.sort((a, b) => a.timestamp - b.timestamp);
};

const fileToDataUri = (file: File): Promise<string> => 
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

interface MessageContent {
  text?: string;
  file?: File;
}

export const sendMessage = async (fromUserId: string, toUserId: string, content: MessageContent): Promise<ChatMessage> => {
    if (!content.text && !content.file) {
        throw new Error("Cannot send an empty message.");
    }
    
    const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        fromUserId,
        toUserId,
        text: content.text,
        timestamp: Date.now(),
        read: false,
    };

    if (content.file) {
        newMessage.file = await fileToDataUri(content.file);
        newMessage.fileName = content.file.name;
        newMessage.fileType = content.file.type;
    }

    database.chat_messages.push(newMessage);

    const fromUser = database.users.find(u => u.id === fromUserId);
    if(fromUser){
        const newNotification: Notification = {
            id: `notif_${Date.now()}_chat`,
            userId: toUserId,
            type: NotificationType.CHAT,
            message: `New message from ${fromUser.name}`,
            timestamp: Date.now(),
            read: false,
        };
        database.notifications.push(newNotification);
        window.dispatchEvent(new CustomEvent('newNotification', { detail: newNotification }));
    }

    persistDatabase();
    
    window.dispatchEvent(new CustomEvent('newMessage', { detail: newMessage }));
    return newMessage;
};

export const markMessagesAsRead = async (currentUserId: string, otherUserId: string): Promise<void> => {
    let changed = false;
    database.chat_messages.forEach(msg => {
        if (msg.fromUserId === otherUserId && msg.toUserId === currentUserId && !msg.read) {
            msg.read = true;
            changed = true;
        }
    });
    if (changed) {
        persistDatabase();
        window.dispatchEvent(new CustomEvent('messagesRead', { detail: { from: otherUserId, to: currentUserId } }));
    }
};

export const getUnreadMessageCounts = (currentUserId: string): Record<string, number> => {
    const counts: Record<string, number> = {};
    for (const msg of database.chat_messages) {
        if (msg.toUserId === currentUserId && !msg.read) {
            counts[msg.fromUserId] = (counts[msg.fromUserId] || 0) + 1;
        }
    }
    return counts;
};

export const getOnlineUsers = async (currentUserId: string): Promise<string[]> => {
    // Simulate some users being online using a simple deterministic logic
    return database.users
        .filter(u => u.id !== currentUserId && (u.id.charCodeAt(u.id.length - 1) % 2 === 0))
        .map(u => u.id);
};
