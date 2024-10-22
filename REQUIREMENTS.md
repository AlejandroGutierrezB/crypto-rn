# Mobile technical challenge

**Title:** React Native Cryptocurrency Tracker

**Description:**
As a senior software engineer, you are expected to have experience building complex applications with a focus on performance, scalability, and maintainability. In this challenge, you are tasked with creating a React Native application that tracks the prices of various cryptocurrencies and allows users to view detailed information about each one.

**Requirements:**

1. Fetch and display a list of the top 10 cryptocurrencies by market cap. You can use the CoinGecko API ([https://www.coingecko.com/api/documentation/v3](https://www.coingecko.com/en/api/documentation)) or any other public API of your choice.
2. Display the following information for each cryptocurrency in the list:
    - Name
    - Symbol
    - Current price in USD
    - Market cap rank
    - 24-hour price change percentage
    - 7-day price change percentage
3. Allow users to tap on a cryptocurrency to view more detailed information, such as:
    - Price in multiple currencies (USD, EUR, GBP, etc.)
    - Market cap
    - 24-hour trading volume
    - Circulating supply
    - Total supply (if available)
    - All-time high price
    - All-time low price
    - Price chart (last 30 days)
4. Implement a search functionality that allows users to search for a specific cryptocurrency by name or symbol. The search results should display the same information as the top 10 list, and tapping on a result should show the detailed information view.
5. Optimize the performance of the application by implementing efficient data fetching, caching, and state management techniques.
6. Ensure the application works on both iOS and Android platforms.
7. Write clean, modular, and well-documented code.
8. Include unit tests to cover critical parts of the application.

**Caveats:**

CoinGecko is currently under rebranding and is imposing a stricter API limit policy.

Please be aware that you’ll face API errors due to rate limiting. Caching and error handling are appreciated.

Alternative API:

[Swagger UI](https://crypto-backend-y6or.onrender.com/docs/#/default)

**Bonus:**

1. Implement pagination or infinite scrolling to load more cryptocurrencies as the user scrolls down the list.
2. Add a feature for users to mark their favorite cryptocurrencies and view them in a separate list.
3. Make the application responsive to work on iPad and smartphone.

**Evaluation Criteria:**

1. Functionality: The application should meet all the requirements and function smoothly on both platforms.
2. Code Quality: The code should be clean, modular, well-organized, and easy to understand.
3. Performance: The application should have efficient data fetching, caching, and state management to ensure a smooth user experience.
4. Testing: The application should include unit and/or integration tests to cover critical parts of the app.
5. Bonus Features: Additional points will be awarded for implementing bonus features that enhance the overall user experience.
6. UI Design: the UI of the app will not be taken into account. Feel free to pick any UI library you like or to code a basic custom UI without spending too much focus on this