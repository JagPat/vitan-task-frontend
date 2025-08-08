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
        # Log out or navigate to the login page to start OAuth login test.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div/div[2]/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Switch to Email tab and input registered user credentials for OAuth login.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Log out the current user to reach the login page for OAuth login test.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click the login button to open the login modal for OAuth login.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div/div[2]/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input registered user's email 'test' into the email address field and send verification code.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[3]/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('test@example.com')
        

        # Check for verification code input or any new prompt and handle it before proceeding.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Scroll down to find a logout button or user profile menu to log out the current user.
        await page.mouse.wheel(0, window.innerHeight)
        

        # Click the login button at the bottom left to open the login modal and check if it allows logging out or switching user.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div/div/div/div/div[2]/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click the 'Send Verification Code' button to proceed with OAuth login.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/div[3]/form/div[3]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Input the 6-digit verification code and click Verify to complete OAuth login.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('123456')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[3]/div[2]/form/div[2]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert that the page title is correct indicating dashboard access
        assert 'WhatsTask - Project Management' in await page.title()
        
        # Assert that the logged in user's name and email are displayed correctly
        user_name_locator = page.locator('text=Rajeev Patel')
        user_email_locator = page.locator('text=test@example.com')
        assert await user_name_locator.is_visible()
        assert await user_email_locator.is_visible()
        
        # Assert that the navigation links for dashboard are present
        expected_nav_links = ['Dashboard', 'All Tasks', 'Projects', 'My Tasks', 'Team', 'Analytics', 'Templates', 'AI Admin', 'Deleted Tasks']
        for link_text in expected_nav_links:
            nav_link = page.locator(f'text={link_text}')
            assert await nav_link.is_visible()
        
        # Assert that the user greeting is shown correctly
        greeting_locator = page.locator('text=Good afternoon, Rajeev')
        assert await greeting_locator.is_visible()
        
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    