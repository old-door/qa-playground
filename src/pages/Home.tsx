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
        <li><strong>/table</strong> — table with sortable columns</li>
        <li><strong>/items</strong> — items list with filters</li>
      </ul>

      <p>
        All data is hardcoded for predictability. No external networking. Run the app on <code>localhost</code>.
      </p>
    </div>
  )
}