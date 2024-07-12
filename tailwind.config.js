/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        DEFAULT: '1372px'
      }
    },
    before: {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '22px',
      height: '22px',
      'border-radius': '50%',
      border: '6px solid #ffb700'
    },
    after: {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '22px',
      height: '22px',
      'border-radius': '50%',
      border: '6px solid #ffb700'
    },

    extend: {
      fontSize: {
        '10px': '10px',
        '8px': '8px',
        '15px': '15px',
        '22px': '22px',
        base: '1rem'
      },
      backgroundImage: {
        'cover-image':
          'linear-gradient(180deg, rgba(26, 22, 46, 0) 0%, #1a162e 100%), url("src/assets/img/profile/cover.png")'
      },
      fontFamily: {
        body: ['Lexend Deca', 'sans-serif']
      },
      // colors: {
      //   'text-color': '#1a162e',
      //   'body-bg': '#f6f6f6'
      // },

      padding: {
        full: '100%'
      },
      boxShadow: {
        custom: '0px 20px 60px 10px rgba(200, 200, 200, 0.4)'
      },
      width: {
        'min-424': 'min(424px, 100%)',
        'min-460': 'min(460px, 100%)',
        'min-500px-100vw': 'min(500px, 100vw)'
      },
      maxWidth: {
        412: '412px'
      },
      colors: {
        'text-color': 'var(--text-color)',
        'body-bg': 'var(--body-bg)',
        viewall: '#0071dc',
        nut: '#f8f8fb',
        desc: '#9e9da8',
        primary: '#ffb700',
        auth_intro_text_color: '#1A162E',
        auth_heading_color: '#1A162E',
        error: '#ed4337',
        header: '#eee',

        light: {
          auth_intro_bg: '#fff',
          auth_content_bg: '#fff',
          auth_intro_text_color: '#1A162E',
          auth_heading_color: '#1A162E'
        },
        dark: {
          auth_intro_bg: '#292e39',
          auth_content_bg: '#171c28',
          auth_intro_text_color: '#b9babe',
          auth_heading_color: '#b9babe'
        }
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          '.before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '22px',
            height: '22px',
            'border-radius': '50%',
            border: '6px solid #ffb700',
            background: 'var(--filter-form-bg)'
          },
          '.after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '22px',
            height: '22px',
            'border-radius': '50%',
            border: '6px solid #ffb700',
            background: 'var(--filter-form-bg)'
          }
        },
        ['before', 'after']
      )
    }
  ]
}
