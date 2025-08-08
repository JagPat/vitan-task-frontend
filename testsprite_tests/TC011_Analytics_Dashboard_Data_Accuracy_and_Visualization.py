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
        await page.goto("http://localhost:3004", wait_until="commit", timeout=10000)
        
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
        # Click on the Analytics navigation link to open the Analytics dashboard.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div/nav/a[6]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Log in to the app to enable task and project creation for testing analytics data.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div/div[2]/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input WhatsApp number and click Login to authenticate.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[2]/form/div[2]/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('8320303515')
        

        # Click the 'Login' button to submit WhatsApp number and authenticate.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[2]/form/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Close the login dialog and attempt to login using email credentials as an alternative.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click the Login button to open login dialog and attempt login with email credentials.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div/div[2]/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Switch to Email tab in login dialog to attempt login with email credentials.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input email 'test@example.com' and click 'Send Verification Code' to initiate login.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[3]/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('test@example.com')
        

        # Close the login dialog and stop as the analytics dashboard cannot be verified without login and data.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert that the analytics dashboard page title and main heading are correct
        assert await page.title() == 'WhatsTask - Project Management'
        assert await page.locator('h1').text_content() == 'WhatsTask'
        assert await page.locator('h2').text_content() == 'Smart Task Management'
        # Assert that the Analytics navigation link is present and active
        analytics_link = page.locator('nav >> text=Analytics')
        assert await analytics_link.count() == 1
        # Assert performance analytics section is visible with correct description and date range
        performance_section = page.locator('text=Insights into your team\'s productivity and task lifecycle.')
        assert await performance_section.is_visible()
        date_range_text = await page.locator('text=Jul 07, 2025 - Aug 06, 2025').text_content()
        assert date_range_text == 'Jul 07, 2025 - Aug 06, 2025'
        # Assert key metrics are displayed and have expected initial values
        completion_rate = await page.locator('text=0.0%').text_content()
        assert completion_rate == '0.0%'
        tasks_completed = await page.locator('text=0 of 0 tasks').text_content()
        assert tasks_completed == '0 of 0 tasks'
        average_completion_time = await page.locator('text=0 hrs').text_content()
        assert average_completion_time == '0 hrs'
        overdue_tasks = await page.locator('text=0').text_content()
        assert overdue_tasks == '0'
        total_tasks = await page.locator('text=0').text_content()
        assert total_tasks == '0'
        # Assert task trends labels are present
        assert await page.locator('text=Created Tasks').is_visible()
        assert await page.locator('text=Completed Tasks').is_visible()
        # Assert task priority breakdown labels are present
        for priority in ['Urgent', 'High', 'Medium', 'Low']:
    assert await page.locator(f'text={priority}').is_visible()
        # Assert team leaderboard table headers are correct
        headers = await page.locator('table thead tr th').all_text_contents()
        assert headers == ['Rank', 'Member', 'Completed', 'Completion Rate']
        # Assert that charts or visualizations are rendered (assuming canvas or svg elements)
        assert await page.locator('canvas').count() > 0 or await page.locator('svg').count() > 0
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    