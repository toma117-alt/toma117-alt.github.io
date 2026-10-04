// All portfolio content lives here. Edit this file to update the site.
export const GITHUB_USER = 'toma117-alt';
export const GITHUB_PROFILE = `https://github.com/${GITHUB_USER}`;
const repo = (name) => `${GITHUB_PROFILE}/${name}`;
// Projects without a dedicated repo yet fall back to the repository list.
const REPOS_PAGE = `${GITHUB_PROFILE}?tab=repositories`;

export const projects = [
  {
    title: 'Microgrid Frequency & Voltage Control using PSO',
    short: 'PSO Microgrid Control',
    icon: 'grid',
    tags: ['MATLAB/Simulink', 'PSO', 'Microgrid'],
    points: [
      'Developed a microgrid control model using MATLAB/Simulink.',
      'Applied Particle Swarm Optimization (PSO) for frequency and voltage regulation.',
    ],
    repo: repo('-PSO-for-frequency-and-voltage-regulation'),
  },
  {
    title: 'Underfrequency Load Shedding Implementation',
    short: 'UF Load Shedding',
    icon: 'wave',
    tags: ['Power Systems', 'Stability', 'Simulation'],
    points: [
      'Simulated underfrequency load shedding schemes for maintaining power-system stability.',
      'Evaluated system recovery and frequency response during disturbances.',
    ],
    repo: null,
  },
  {
    title: 'Temperature Dependent VFD',
    short: 'Temp-Dependent VFD',
    icon: 'thermo',
    tags: ['Motor Drives', 'Control', 'Embedded'],
    points: [
      'Designed a temperature-dependent variable frequency drive control mechanism.',
      'Implemented automatic control based on temperature variation.',
    ],
    repo: null,
  },
  {
    title: 'Shell Type Transformer (100 VA)',
    short: '100 VA Transformer',
    icon: 'coil',
    tags: ['Machines', 'Hardware', 'Design'],
    points: [
      'Designed and constructed a shell-type transformer with specified rating and performance characteristics.',
      'Analyzed transformer efficiency and operational behavior under load conditions.',
    ],
    repo: null,
  },
  {
    title: 'Obstacle Avoiding Drone',
    short: 'Obstacle-Avoiding Drone',
    icon: 'drone',
    tags: ['Robotics', 'Sensors', 'Autonomy'],
    points: [
      'Developed a drone system capable of autonomous obstacle detection and avoidance.',
      'Integrated sensor-based navigation techniques.',
    ],
    repo: null,
  },
  {
    title: 'Digital Vending Machine FSM',
    short: 'Vending Machine FSM',
    icon: 'chip',
    tags: ['Verilog HDL', 'FSM', 'Digital Logic'],
    points: [
      'Designed a finite state machine (FSM) based vending machine using Verilog HDL.',
      'Simulated digital logic behavior and state transitions.',
    ],
    repo: null,
  },
  {
    title: 'Ultrasonic Object Mapping Bot',
    short: 'Ultrasonic Mapping Bot',
    icon: 'radar',
    tags: ['Robotics', 'Ultrasonic', 'Mapping'],
    points: [
      'Developed a robotic mapping system using ultrasonic sensing.',
      'Implemented obstacle detection and environmental scanning functionality.',
    ],
    repo: null,
  },
  {
    title: 'DC Voltmeter',
    short: 'DC Voltmeter',
    icon: 'meter',
    tags: ['Analog Circuits', 'Measurement'],
    points: ['Designed and implemented a DC voltmeter circuit for voltage measurement applications.'],
    repo: repo('DC-voltmeter'),
  },
  {
    title: 'FM-Based Image Transmission via Radio Wave',
    short: 'FM Image Transmission',
    icon: 'antenna',
    tags: ['Communication', 'FM', 'Signal Processing'],
    points: ['Implemented image transmission using frequency modulation techniques over radio communication systems.'],
    repo: null,
  },
  {
    title: 'Brain Tumor Detection on MRI Image',
    short: 'Brain Tumor Detection',
    icon: 'brain',
    tags: ['Image Processing', 'Medical Imaging'],
    points: ['Applied image processing techniques for automated brain tumor detection using MRI images.'],
    repo: null,
  },
  {
    title: "Solving Poisson's Equation of Electrostatics",
    short: "Poisson's Equation Solver",
    icon: 'field',
    tags: ['Numerical Methods', 'Electrostatics'],
    points: [
      'Solved two-dimensional electrostatic field problems using numerical techniques.',
      'Analyzed potential distribution and convergence behavior.',
    ],
    repo: repo('solving-Poisson-s-equation'),
  },
].map((p) => ({ ...p, hasRepo: !!p.repo, repo: p.repo || REPOS_PAGE }));

export const thesis = {
  title:
    'Enhanced Electromagnetic Field Optimization with Epsilon-Constraint for Optimal Sizing of Hybrid PV-Battery-Diesel System in Sandwip Island, Bangladesh',
  type: 'Undergraduate Thesis · B.Sc. Engg. (EEE), BUET',
  supervisor: 'Dr. Ahmed Zubair, Professor, Department of EEE, BUET',
  repo: repo('HES-optimization'),
  points: [
    'Developed a multi-objective optimization framework for optimal sizing of hybrid PV-Battery-Diesel systems.',
    'Applied Enhanced Electromagnetic Field Optimization (EEFO) integrated with the Epsilon-Constraint method to obtain Pareto-optimal solutions.',
    'Evaluated system performance using Net Present Cost (NPC), Cost of Energy (COE), renewable energy penetration, and system reliability indices.',
    'Conducted a case study for Sandwip Island, Bangladesh, considering local renewable resources and load demand characteristics.',
    'Analyzed the economic, technical, and reliability performance of different hybrid energy-system configurations using simulation and optimization techniques.',
  ],
  metrics: ['NPC', 'COE', 'RE Penetration', 'Reliability'],
};

export const timeline = [
  {
    when: 'Jan 2022 – Jun 2026',
    kind: 'Education',
    title: 'B.Sc. Engg. in Electrical & Electronic Engineering',
    org: 'Bangladesh University of Engineering and Technology (BUET)',
    detail: 'CGPA: 3.40 / 4.00',
  },
  {
    when: 'Nov 2025',
    kind: 'Experience',
    title: 'Industrial Attachment',
    org: 'Dhaka Electric Supply Company PLC (DESCO) · Sales & Distribution Division, Bashundhara, Dhaka',
    points: [
      'Participated in industrial attachment activities covering electricity distribution, metering, billing, and load management.',
      'Gained exposure to substation operation and maintenance, control-room activities, and distribution-line maintenance.',
      'Observed pre-paid metering, power-factor monitoring and upgrading, new connections, and load sanction and retention procedures.',
      'Studied disconnection and reconnection procedures and One Point Service Center operations.',
      'Gained exposure to wireless and telecommunication systems and Distribution Automation System (DAS) maintenance.',
    ],
  },
  {
    when: '2025 – 2026',
    kind: 'Leadership',
    title: 'Treasurer',
    org: 'Murchona – Musical Club of BUET',
    points: [
      'Managed budgeting and financial coordination for club activities and events.',
      'Coordinated organizational activities with executive members.',
    ],
  },
  {
    when: '2025 – 2026',
    kind: 'Leadership',
    title: 'Assistant Office Secretary',
    org: 'Kantho – Recitation Club of BUET',
    points: [
      'Assisted in administrative and communication-related activities.',
      'Supported event organization and documentation.',
    ],
  },
  {
    when: 'Jun 2018 – Jan 2021',
    kind: 'Education',
    title: 'Higher Secondary Certificate (HSC)',
    org: 'Holy Cross College',
    detail: 'GPA: 5.00 / 5.00',
  },
  {
    when: 'Jan 2007 – May 2018',
    kind: 'Education',
    title: 'Secondary School Certificate (SSC)',
    org: "Bangla Bazar Govt. Girls' High School",
    detail: 'GPA: 5.00 / 5.00',
  },
];

export const skills = {
  'Programming': ['Python', 'C', 'C++', 'MATLAB', 'Verilog HDL'],
  'Tools & Simulation': ['MATLAB/Simulink', 'HOMER Pro', 'AutoCAD', 'LTspice', 'PSpice', 'PSAF 2.81'],
  'Electrical & Hardware': ['Electrical System Design', 'Control Systems', 'PCB Design', 'Hardware Implementation', 'Simulation & Analysis'],
  'Lab Equipment': ['Oscilloscope', 'Function Generator', 'Digital Multimeter'],
  'Soft Skills': ['Team Collaboration', 'Problem Solving', 'Technical Presentation', 'Project Coordination'],
};

export const interests = [
  'Renewable Energy Systems', 'Solar PV & Hybrid Energy Systems', 'Power System Optimization',
  'Smart Grid Technologies', 'Microgrids', 'Energy Storage Systems', 'Embedded Systems',
  'Control Systems', 'Optimization Techniques',
];

export const personalInterests = [
  'Renewable Energy', 'Solar PV Systems', 'EV Technologies', 'Embedded Systems',
  'Robotics', 'Technical Innovation', 'Cultural Activities',
];
