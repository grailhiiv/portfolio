// Actual 1440px content cap, 16px gutters, and responsive grid gaps.
export const imageSizes = {
  // A 3:2 source covers a 3:4 phone frame at twice its visible width.
  aboutHero:
    "(min-width: 1472px) 1440px, (min-width: 768px) calc(100vw - 32px), calc(200vw - 64px)",
  full: "(min-width: 1472px) 1440px, calc(100vw - 32px)",
  portrait:
    "(min-width: 1472px) 718px, (min-width: 768px) calc((100vw - 36px) / 2), calc(100vw - 32px)",
  paired: "(min-width: 1472px) 718px, calc((100vw - 36px) / 2)",
  homeCard:
    "(min-width: 1472px) 354px, (min-width: 1024px) calc((100vw - 56px) / 4), (min-width: 768px) calc((100vw - 48px) / 3), calc((100vw - 40px) / 2)",
  clientLogo:
    "(min-width: 1472px) 168px, (min-width: 768px) calc((100vw - 132px) / 8), calc((100vw - 64px) / 3)",
};
