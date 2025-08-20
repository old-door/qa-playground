export default function Home() {
  return (
    <div data-testid="home-page">
      <h1>QA Playground</h1>
      <p>
        Small React playground for demonstrating QA automation approaches using TypeScript and Playwright.
      </p>
      <p>Routes:</p>
      <ul>
        <li><strong>/</strong> — this page</li>
        <li><strong>/table</strong> — A sortable table with multiple column types.</li>
        <li><strong>/items</strong> — An item catalog with various filters.</li>
        <li><strong>/chart</strong> — A page with a chart (canvas) showing item values and labels.</li>
      </ul>

      <p>
        All data is hardcoded for predictability. No external networking. Run the app on <code>localhost</code>.
      </p>
    </div>
  )
}