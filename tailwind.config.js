module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    boxShadow: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    },
    minWidth: {
      0: "0",
      20: "20rem",
      25: "25rem",
      30: "30rem",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
    },
    extend: {
      colors: {
        default: "#BDC1C6",
        text: "#E2E2E3",
        input: "#9CA3AF",
        option: "#E8EAED",
        lightblue: "#8AB4F8",
        lightblue2: "#93BAF9",
        lightblue3: "#A1C3F9",
        lightgrey: "#303134",
        lightgrey2: "#5F6368",
        lightgrey3: "#373737",
        darkgrey: "#202124",
        darkgrey2: "#969BA1",
        darkgrey3: "#313235",
        spotify1: "#1AA64B",
        spotify2: "#1DB954",
        spotify3: "#33C065",
        pop: "#217BE3",
        country: "#EBE7E9",
        electronic: "#E86D38",
        folk: "#8C554B",
        rap: "#9ACFC7",
        jazz: "#A836F6",
        rock: "#8E1906",
        metal: "#928F98",
        classical: "#FBDD47",
        soul: "#E2AFD1",
        indie: "#F9E6C1"
      },
      boxShadow: {
        custom:
          "0 4px 5px 0 rgb(0 0 0 / 14%), 0 1px 10px 0 rgb(0 0 0 / 12%), 0 2px 4px -1px rgb(0 0 0 / 20%)",
      },
      spacing: {
        2.25: "0.562rem",
        13: "3.25rem",
        57.5: "14.4rem",
        66: "16.5rem",
        70: "17.5rem",
      },
      maxWidth: {
        "1/2": "50vw",
        "3/4": "75vw",
        "6/7": "85vw",
        "9/10": "90vw",
        "2xs": "17.5rem",
        "8xl": "88rem"
      },
      screens: {
        "3xl": "1600px",
        "4xl": "2500px"
      },
      width: {
        "74%": "74.8%",
        "7/10": "69.3%",
        "84%" : "84.8%",
        "48%": "48%",
        "pic": "260px"
      },
      height: {
        "pic": "260px"
      }
    },
  },
  plugins: [],
};
