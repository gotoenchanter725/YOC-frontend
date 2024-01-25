/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '978px',
        xl: '1024PX',
        '2xl': '1280px',
        '3xl': '1440px',
        '4xl': '1564px',
        '5xl': '1640px',
      },
      fontSize: {
        xs: ['8px', '10px'],
        sm: ['10px', '12px'],
        md: ['12px', '14px'],
        base: ['14px', '16px'],
        lg: ['16px', '18px'],
        xl: ['18px', '20px'],
        '2xl': ['20px', '24px'],
        '3xl': ['22px', '26px'],
        '4xl': ['30px', '40px'],
        '5xl': ['48px', '1'],
        '6xl': ['60px', '1'],
        '7xl': ['72px', '1'],
        '8xl': ['96px', '1'],
        '9xl': ['128px', '1'],
      },
      colors: {
        // text color
        'primary': 'white',
        'secondary': '#2AF6FF',
        'dark-primary': "#999999",
        'dark-secondary': '#bbbbbb',
        // button background
        'btn-primary': 'rgba(67, 227, 224, 0.57)',
        'btn-secondary': '#7212EF',
        'btn-disable': "#2a4142",
        // border
        'border-primary': '#97FBFF',
        "border-secondary": "#3b3b3b",
        // bg color
        'body-primary': "#1E1E1E",
        'body-secondary': "#141130",
        'status-plus': '#0ead56',
        'status-minus': '#ef4444',
        'status-active': '#0ead56',
        'status-disable': '#898989',
        'status-warning': '#e5ce1f',
      },
      backgroundImage: {
        'primary-pattern': "linear-gradient(90.46deg, rgba(30, 30, 30, 0.12) -18.76%, rgba(173, 173, 173, 0.12) 72.39%)",
        'secondary-pattern': "linear-gradient(90.46deg, rgba(83, 75, 177, 0.12) -18.76%, rgba(228, 204, 81, 0.12) 72.39%)",
        'bg-pattern': 'linear-gradient(180deg, rgba(0, 220, 159, 0.105) 34.7%, rgba(188, 44, 216, 0.06) 100%)',
        'arrow-down': "url('./public/images/arrow-down.png')",
        'tr-gradient': 'radial-gradient(50.03% 50.02% at 49.8% 50.03%, rgba(66, 232, 224, 0.85) 0%, #36A6A1 43.75%, #00000000 100%)',
        'normal-pattern': 'linear-gradient(90.46deg, rgba(118, 118, 118, 0.12) -18.76%, rgba(173, 173, 173, 0.12) 72.39%)',
        'row-pattern': 'linear-gradient(90.46deg, rgba(0, 220, 159, 0.12) -18.76%, rgba(173, 173, 173, 0.12) 72.39%)',
        'box-pattern': "linear-gradient(90.46deg, rgba(30, 30, 30, 0.06) -18.76%, rgba(252, 252, 252, 0.083) 72.39%)",
        'card-pattern': "linear-gradient(180deg, rgba(0, 220, 159, 0.1) 34.7%, rgba(188, 44, 216, 0.02) 100%)"
      },
      boxShadow: {
        'big': '0px 4px 35px #2af6ff5c',
        'btn-primary': "0px 4px 10px #2af6ff5c",
        'btn-secondary': "0px 4px 10px #5A5AE65c"
      },
      container: {
        screens: {
          sm: '640px',
          md: '768px',
          lg: '978px',
          xl: '1024PX',
          '2xl': '1280px',
          '3xl': '1440px',
          '4xl': '1564px',
          '5xl': '1640px',
        },

        padding: {
          DEFAULT: "1rem",
          'sm': '1rem',
          'md': "1rem",
          'lg': '1rem',
          'xl': '1rem',
          '2xl': '1rem'
        }
      },
      borderWidth: {
        1: '1px'
      }
    },
  },
  corePlugins: {
    container: false
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          'maxWidth': "100%",
          '@screen sm': {
            maxWidth: '640px',
            minWidth: '600px'
          },
          '@screen md': {
            maxWidth: '768px',
            minWidth: '640px'
          },
          '@screen lg': {
            maxWidth: '1024px',
            minWidth: '768px'
          },
          '@screen xl': {
            maxWidth: '1280px',
            minWidth: '1024px'
          },
          '@screen 2xl': {
            maxWidth: '1440px',
            minWidth: '1280px'
          },
          '@screen 3xl': {
            maxWidth: '1564px',
            minWidth: '1200px'
          },
          '@screen 4xl': {
            maxWidth: '1640px',
            minWidth: '1400px'
          },
        }
      })
    },
    require('tailwind-scrollbar')({ nocompatible: true })
  ],
}