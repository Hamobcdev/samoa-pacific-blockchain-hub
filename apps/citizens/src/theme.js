export const CL = {
  // Backgrounds — warm Pacific tapa cloth tones
  background:   '#F5F0E8',
  surface:      '#FFFFFF',
  surface2:     '#EDE6D8',
  surfaceBlue:  '#EEF3FB',

  // Government Primary
  primary:      '#003087',
  primaryDark:  '#001F5C',
  primaryLight: '#D6E4FF',

  // Pacific Accents
  accent:       '#CE1126',
  gold:         '#C9A227',
  goldLight:    '#FFF3CC',

  // Text
  text:         '#1A1A2E',
  textSoft:     '#3A3A5C',
  muted:        '#7A7A9A',
  placeholder:  '#AAAAC0',

  // Borders
  border:       '#DDD6C8',
  border2:      '#C8BFB0',

  // Status
  success:      '#00793D',
  successLight: '#E6F4EC',
  warning:      '#B87000',
  warningLight: '#FFF3E0',
  error:        '#C0001A',
  errorLight:   '#FDE8EB',

  // Ministry colours
  cbs:          '#C9A227',
  mcit:         '#003087',
  mof:          '#00793D',
  education:    '#00A090',
  mcil:         '#CE1126',
  customs:      '#B87000',
  sbs:          '#7040A8',
}

export const FL = {
  display: 'Cormorant Garamond',
  ui:      'DM Sans',
  mono:    'IBM Plex Mono',
}

export const SERVICE_CATEGORIES = [
  { id: 'identity',  icon: '◉', color: '#003087', ministry: 'SBS/MCIL' },
  { id: 'business',  icon: '⬡', color: '#CE1126', ministry: 'MCIL' },
  { id: 'health',    icon: '✦', color: '#00793D', ministry: 'MOH' },
  { id: 'education', icon: '◈', color: '#00A090', ministry: 'EDUCATION' },
  { id: 'land',      icon: '⬟', color: '#B87000', ministry: 'MNRE' },
  { id: 'finance',   icon: '◆', color: '#7040A8', ministry: 'MOF' },
  { id: 'travel',    icon: '◎', color: '#003087', ministry: 'IMMIGRATION' },
  { id: 'police',    icon: '⬢', color: '#CE1126', ministry: 'POLICE' },
]

export const FEATURED_SERVICES = [
  {
    id: 'police_clearance',
    category: 'police',
    nameKey: 'Police Clearance Certificate',
    fee: 'WST 25',
    time: '3-5 days',
    ministry: 'Samoa Police Service',
    ministryCode: 'POLICE',
    popular: true,
  },
  {
    id: 'birth_certificate',
    category: 'identity',
    nameKey: 'Birth Certificate',
    fee: 'WST 15',
    time: '1-2 days',
    ministry: 'MCIL Civil Registry',
    ministryCode: 'MCIL',
    popular: true,
  },
  {
    id: 'business_registration',
    category: 'business',
    nameKey: 'Business Registration',
    fee: 'WST 150',
    time: '5-7 days',
    ministry: 'Ministry of Commerce',
    ministryCode: 'MCIL',
    popular: false,
  },
  {
    id: 'tax_clearance',
    category: 'finance',
    nameKey: 'Tax Clearance Certificate',
    fee: 'WST 0',
    time: 'Same day',
    ministry: 'Ministry of Finance',
    ministryCode: 'MOF',
    popular: true,
  },
]
