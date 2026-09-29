const base = {
  width: 15,
  height: 15,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const SunIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="4.5" />
    <line x1="12" y1="1.5" x2="12" y2="3.5" />
    <line x1="12" y1="20.5" x2="12" y2="22.5" />
    <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" />
    <line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
    <line x1="1.5" y1="12" x2="3.5" y2="12" />
    <line x1="20.5" y1="12" x2="22.5" y2="12" />
    <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" />
    <line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
  </svg>
);

export const MoonIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
  </svg>
);

export const PlusIcon = (props) => (
  <svg {...base} {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const SearchIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="7.5" />
    <line x1="21" y1="21" x2="16" y2="16" />
  </svg>
);

export const PencilIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

export const TrashIcon = (props) => (
  <svg {...base} {...props}>
    <polyline points="3.5 6.5 5.5 6.5 21.5 6.5" />
    <path d="M19 6.5v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-14m3 0v-2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" />
    <line x1="10.5" y1="11" x2="10.5" y2="17" />
    <line x1="14.5" y1="11" x2="14.5" y2="17" />
  </svg>
);

export const XIcon = (props) => (
  <svg {...base} {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
