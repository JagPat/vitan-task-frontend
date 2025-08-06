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
        # Click the Login button to navigate to the login page.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div/div[2]/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input a valid WhatsApp phone number in the phone input field.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[2]/form/div[2]/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('8320303515')
        

        # Click the 'Verify Account' button to request OTP via WhatsApp.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[2]/form/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input the received 6-digit OTP code into the verification code input field.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('123456')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert that the user is redirected to the dashboard page by checking the page title and header text.
        assert await frame.title() == 'WhatsTask - Project Management'
        header_text = await frame.locator('xpath=//header//h1').text_content()
        assert header_text == 'WhatsTask - Smart Task Management'
        # Assert that the navigation links are present and correct.
        nav_links = await frame.locator('xpath=//nav//a').all_text_contents()
        expected_links = ['Dashboard', 'All Tasks', 'Projects', 'My Tasks11', 'Team', 'Analytics', 'Templates', 'AI Admin', 'Deleted Tasks']
        assert nav_links == expected_links
        # Assert that the greeting message is displayed correctly indicating successful login.
        greeting = await frame.locator('xpath=//div[contains(text(),"Good morning")]').text_content()
        assert greeting.startswith('Good morning')
        # Assert that the WhatsApp status shows connected and active.
        whatsapp_status = await frame.locator('xpath=//div[contains(text(),"Connected & Active")]').text_content()
        assert 'Connected & Active' in whatsapp_status
        # Assert that the task summary section is visible and contains expected data.
        task_summary_text = await frame.locator('xpath=//section[contains(@class,"task-summary")]').text_content()
        assert 'All caught up!' in task_summary_text
        # Assert that the dashboard tabs are present.
        tabs = await frame.locator('xpath=//div[contains(@class,"task-overview-tabs")]//button').all_text_contents()
        expected_tabs = ['All', 'Pending', 'Active', 'Overdue']
        assert tabs == expected_tabs
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    