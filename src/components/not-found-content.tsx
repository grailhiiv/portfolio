import NotFoundAnimation from "@/components/not-found-animation";

export default function NotFoundContent() {
  return (
    <main id="main-content" className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__title">404</h1>
        <NotFoundAnimation />
      </div>
    </main>
  );
}
