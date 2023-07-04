/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}'
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				charcoal: {
					50: '#B0B5BF',
					100: '#A5ABB6',
					200: '#9AA0AC',
					300: '#8F96A3',
					400: '#848B9A',
					500: '#788091',
					600: '#6E7687',
					700: '#656C7B',
					800: '#5C6270',
					900: '#535865',
					DEFAULT: '#494F5A'
				},
				gold: {
					100: '#EFEDBD',
					200: '#EBE9AD',
					300: '#E7E59C',
					400: '#E3E08C',
					500: '#DFDC7C',
					600: '#DBD76B',
					700: '#D7D35B',
					800: '#D3CF4A',
					900: '#CFCA3A',
					DEFAULT: '#C5C030'
				},
				uranian: {
					DEFAULT: '#BCE7FD',
					100: '#B0E3FD',
					200: '#9CDCFC',
					300: '#88D5FB',
					400: '#75CEFA',
					500: '#62C7F9',
					600: '#4EC0F9',
					700: '#3AB9F8',
					800: '#26B2F7',
					900: '#13ABF6',
					1000: '#0679B2',
					1100: '#056B9E'
				},
				seagreen: {
					100: '#53F3B3',
					200: '#40F2AB',
					300: '#2DF0A2',
					400: '#1AEF9A',
					500: '#0FD284',
					600: '#0FD284',
					700: '#0DBF78',
					800: '#0CAC6C',
					900: '#0B9860',
					DEFAULT: '#0A8754'
				},
				raspberry: {
					DEFAULT: '#EB5160'
				}
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require('tailwindcss-animate')]
}
