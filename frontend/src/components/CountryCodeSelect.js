import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
const countryCodes = [
    { code: '+1', country: 'USA/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+61', country: 'Australia' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+86', country: 'China' },
    { code: '+971', country: 'UAE' },
    // Add more as needed
];
export const CountryCodeSelect = ({ value, onChange, className }) => {
    return (_jsx("select", { value: value, onChange: (e) => onChange(e.target.value), className: className || "mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 border", children: countryCodes.map((c) => (_jsxs("option", { value: c.code, children: [c.code, " (", c.country, ")"] }, c.code))) }));
};
