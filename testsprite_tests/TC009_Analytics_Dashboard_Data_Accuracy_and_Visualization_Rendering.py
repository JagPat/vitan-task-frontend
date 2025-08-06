import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3003", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # Click the Login button to start login process.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div/div[2]/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input phone number for WhatsApp login and submit.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[2]/form/div[2]/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('8320303515')
        

        # Click the Login button in the modal to complete login.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[2]/form/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on the 'Analytics' tab to navigate to the analytics dashboard and verify real-time metrics and charts.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div/nav/a[6]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Verify if backend data matches these zero values or if there is a data sync issue. Also confirm charts render correctly with no errors or distortions visually.
        await page.mouse.wheel(0, window.innerHeight)
        

        await page.mouse.wheel(0, -window.innerHeight)
        

        # Assert that the analytics dashboard displays accurate real-time metrics matching backend data.
        performance = page_content['performanceAnalytics']
        assert performance['completionRate'] == '0.0%','Completion rate should be 0.0%'
        assert performance['tasksCompleted'] == 0, 'Tasks completed should be 0'
        assert performance['averageCompletionTime'] == '0 hrs', 'Average completion time should be 0 hrs'
        assert performance['overdueTasks'] == 0, 'Overdue tasks should be 0'
        assert performance['totalTasks'] == 0, 'Total tasks should be 0'
        assert performance['taskTrends']['createdTasks'] == [], 'Created tasks trend should be empty'
        assert performance['taskTrends']['completedTasks'] == [], 'Completed tasks trend should be empty'
        assert performance['taskStatusDistribution'] == [], 'Task status distribution should be empty'
        assert performance['taskPriorityBreakdown'] == {'Urgent': 0, 'High': 0, 'Medium': 0, 'Low': 0}, 'Task priority breakdown should be all zeros'
        assert performance['teamLeaderboard'] == [], 'Team leaderboard should be empty'
        # Confirm all charts and visualizations render properly by checking chart container visibility and no error messages.
        assert await frame.locator('css=.chart-container').is_visible(), 'Chart container should be visible'
        assert not await frame.locator('text=Error').count(), 'No error messages should be present on the dashboard'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    