export default function Footer() {
  return (
    <footer
      id="contact"
      tabIndex={-1}
      className="bg-gray-100 px-4 pt-10 md:pt-16 pb-10 md:pb-12"
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-16 md:gap-64">
        <div>
          <h2 className="text-2xl font-light leading-[1.1] tracking-[-2px] md:tracking-[-2.56px] text-[#111111]">
            {"Connect, collaborate,  "}
            <br />
            {"or just say hello"}
          </h2>
          <a
            href="mailto:ciao@arturospatino.com"
            className="hidden md:block text-2xl font-light text-[#b2b2b2] hover:text-[#111111] transition-colors"
          >
            {"ciao@arturospatino.com"}
          </a>
          <a
            href="mailto:ciao@arturospatino.com"
            className="block md:hidden text-2xl font-light text-[#b2b2b2] hover:text-[#111111] transition-colors"
          >
            {"Email"}
          </a>
        </div>
        <a
          href="https://www.linkedin.com/in/arturo-spatino/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Arturo Spatino on LinkedIn (opens in new tab)"
          className="block text-2xl font-light text-[#b2b2b2] hover:text-[#111111] transition-colors"
        >
          {"LinkedIn"}
        </a>
      </div>
    </footer>
  );
}
