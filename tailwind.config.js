/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'DANGER_BUTTON': '#EF4835',
        'PRIMARY_BUTTON': '#87BE33',
        'SECONDARY_BUTTON': '#FD7E37',
        'SUCCESS_BUTTON': '#33BFBF',
        'INFO_BUTTON': '#8A55D8',
        'WARNING_BUTTON': '#F7A042',
        'LIGHT_BUTTON': '#F5F4E9',
        'LIGHT_DANGER_BUTTON': '#FFE9EC',
        'MAIN_SCREEN_BG':'#F3F6F9',
        'BREAD_CRUMB':'#4D6A00',
        'PRIMARY_TEXT':'#4D6A00',
        'GRAY_BUTTON' : '#78829D'
      }
    },
    borderRadius: {
      
      'large': '50px',
    }
  },
  plugins: [
    // require('@tailwindcss/line-clamp'),
    // ...
  ],
}

