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
        // xs: ['12px', '16px'],
        // sm: ['14px', '20px'],
        md: ['16px', '24px'],
        // base: ['16px', '24px'],
        // lg: ['18px', '28px'],
        // xl: ['20px', '28px'],
        // '2xl': ['24px', '32px'],
        // '3xl': ['30px', '36px'],
        // '4xl': ['36px', '40px'],
        // '5xl': ['48px', '1'],
        // '6xl': ['60px', '1'],
        // '7xl': ['72px', '1'],
        // '8xl': ['96px', '1'],
        // '9xl': ['128px', '1'],
      },
      colors: {
        // text color
        'primary': 'white',
        'secondary': '#2AF6FF',
        'dark-primary': "#8B8B8B",
        'dark-secondary': '#496067',
        // button background
        'btn-primary': 'rgba(67, 227, 224, 0.57)',
        'btn-secondary': '#7212EF',
        'btn-disable': "#2a4142", 
        // border
        'border-primary': '#97FBFF',
        // bg color
        'body-primary': "#1E1E1E",
        'body-secondary': "#141130"
      },
      backgroundImage: {
        'primary-pattern': "linear-gradient(90.46deg, rgba(30, 30, 30, 0.12) -18.76%, rgba(173, 173, 173, 0.12) 72.39%)",
        'secondary-pattern': "linear-gradient(90.46deg, rgba(83, 75, 177, 0.12) -18.76%, rgba(228, 204, 81, 0.12) 72.39%)",
        'bg-pattern': 'linear-gradient(180deg, rgba(0, 220, 159, 0.105) 34.7%, rgba(188, 44, 216, 0.06) 100%)',
        'arrow-down': "url('./public/images/arrow-down.png')",
        'tr-gradient': 'radial-gradient(50.03% 50.02% at 49.8% 50.03%, rgba(66, 232, 224, 0.85) 0%, #36A6A1 43.75%, #00000000 100%)', 
        'normal-pattern': 'linear-gradient(90.46deg, rgba(118, 118, 118, 0.12) -18.76%, rgba(173, 173, 173, 0.12) 72.39%)', 
        'row-pattern': 'linear-gradient(90.46deg, rgba(0, 220, 159, 0.12) -18.76%, rgba(173, 173, 173, 0.12) 72.39%)', 
        'home-box1': "linear-gradient(0deg, rgb(230, 73, 128) 0%, rgb(121, 80, 242) 100%)", 
        'home-box2': "linear-gradient(0deg, rgb(134, 142, 150) 0%, rgb(253, 126, 20) 100%)", 
        'home-box3': "linear-gradient(0deg, rgb(121, 80, 242) 0%, rgb(64, 192, 87) 100%)", 
        'home-box4': "linear-gradient(0deg, rgb(250, 176, 5) 0%, rgb(64, 192, 87) 100%)", 
        'box-pattern': "linear-gradient(90.46deg, rgba(30, 30, 30, 0.06) -18.76%, rgba(252, 252, 252, 0.083) 72.39%);"
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