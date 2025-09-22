// document.addEventListener('DOMContentLoaded', function() {
//   const compareBtn = document.getElementById('compare-btn');
//   const currentProductDiv = document.getElementById('current-product');
//   const comparisonResultsDiv = document.getElementById('comparison-results');
  
//   // Get current tab info
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     const currentTab = tabs[0];
    
//     // Send message to content script to get product info (from PDP page)
//     chrome.tabs.sendMessage(currentTab.id, {message: "get_product_info"}, function(response) {
//       if (response) {
//         displayCurrentProduct(response);
//       } else {
//         currentProductDiv.innerHTML = `
//           <div class="error">
//             Could not retrieve product information. Please refresh the page and try again.
//           </div>
//         `;
//       }
//     });
//   });
  
//   // Display current product
//   function displayCurrentProduct(product) {
//     let badgeClass = product.site === 'amazon' ? 'amazon-badge' : 'flipkart-badge';
//     let badgeText = product.site === 'amazon' ? 'Amazon' : 'Flipkart';
    
//     currentProductDiv.innerHTML = `
//       <span class="site-badge ${badgeClass}">${badgeText}</span>
//       ${product.image ? `<img src="${product.image}" class="product-image">` : ''}
//       <div class="product-title">${product.title}</div>
//       <div class="product-price">${product.price}</div>
//       <div style="clear: both;"></div>
//     `;
//   }
  
//   // Handle compare button click
//   compareBtn.addEventListener('click', function() {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       const currentTab = tabs[0];
      
//       // Send message to content script to get product info
//       chrome.tabs.sendMessage(currentTab.id, {message: "get_product_info"}, function(response) {
//         if (response && (response.site === "amazon" || response.site === "flipkart")) {
//           const searchQuery = extractSearchKeywords(response.title);

//           // Show loading
//           comparisonResultsDiv.innerHTML = `
//             <div class="loading">
//               Searching for similar products on ${response.site === "amazon" ? "Flipkart" : "Amazon"}...
//             </div>
//           `;

//           // Step 1: open the competitor site search page
//           const competitorUrl = response.site === "amazon"
//             ? `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`
//             : `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}`;

//           chrome.tabs.create({ url: competitorUrl, active: false }, function(newTab) {
//             // Step 2: wait for content-script to scrape competitor results
//             setTimeout(() => {
//               chrome.tabs.sendMessage(newTab.id, {message: "get_search_results", originalTitle: response.title}, function(scrapeResponse) {
//                 if (scrapeResponse && scrapeResponse.products && scrapeResponse.products.length > 0) {
//                   // Step 3: match & pick lowest price
//                   let bestMatch = findBestMatch(response.title, scrapeResponse.products);

//                   if (bestMatch) {
//                     displayBestMatch(bestMatch, response.site);
//                   } else {
//                     comparisonResultsDiv.innerHTML = `<p>No close matches found.</p>`;
//                   }
//                 } else {
//                   comparisonResultsDiv.innerHTML = `<p>No products scraped from competitor.</p>`;
//                 }
//               });
//             }, 3000); // wait a bit for competitor page load
//           });

//         } else {
//           comparisonResultsDiv.innerHTML = `
//             <div class="error">
//               Please navigate to a product page on Amazon or Flipkart first.
//             </div>
//           `;
//         }
//       });
//     });
//   });
  
//   // Extract search keywords from product title
//   function extractSearchKeywords(title) {
//     return title
//       .replace(/[^\w\s]/gi, '') 
//       .replace(/\b(the|a|an|and|or|for|of|in|on|at|to|with|by|from|is|are|was|were|be|being|been|this|that|these|those|it|its|amazon|flipkart|online|shopping|buy)\b/gi, '')
//       .replace(/\s+/g, ' ')
//       .trim()
//       .split(' ')
//       .slice(0, 5) 
//       .join(' ');
//   }

//   // ---------- Matching Logic ----------
//   function findBestMatch(originalTitle, products) {
//     let scored = products.map(p => {
//       return {
//         ...p,
//         score: similarityScore(originalTitle, p.title)
//       };
//     });

//     let candidates = scored.filter(p => p.score >= 0.3);
//     if (candidates.length === 0) return null;

//     return getLowestPrice(candidates);
//   }

//   function getLowestPrice(products) {
//     return products.reduce((lowest, item) => {
//       let price = parseInt(item.price.replace(/[^\d]/g, "")) || Infinity;
//       if (!lowest || price < lowest.numericPrice) {
//         return { ...item, numericPrice: price };
//       }
//       return lowest;
//     }, null);
//   }

//   function similarityScore(base, target) {
//     let baseWords = base.toLowerCase().split(/\s+/);
//     let targetWords = target.toLowerCase().split(/\s+/);
//     let common = baseWords.filter(w => targetWords.includes(w));
//     return common.length / baseWords.length;
//   }

//   // ---------- Render competitor best match ----------
//   function displayBestMatch(product, sourceSite) {
//     let competitorSite = sourceSite === "amazon" ? "Flipkart" : "Amazon";

//     comparisonResultsDiv.innerHTML = `
//       <h3>Best match found on ${competitorSite}:</h3>
//       <div class="result-item">
//         <img src="${product.image}" class="result-image">
//         <div class="result-info">
//           <div class="result-title">${product.title}</div>
//           <div class="result-price">₹${product.numericPrice}</div>
//         </div>
//         <button class="view-btn" data-url="${product.url}">View</button>
//       </div>
//     `;

//     document.querySelector('.view-btn').addEventListener('click', function() {
//       chrome.tabs.create({ url: this.getAttribute('data-url') });
//     });
//   }
// });

























//***************************Already working code******************************************** */
document.addEventListener('DOMContentLoaded', function() {
  const compareBtn = document.getElementById('compare-btn');
  const currentProductDiv = document.getElementById('current-product');
  const comparisonResultsDiv = document.getElementById('comparison-results');
  
  // Get current tab info
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    
    // Send message to content script to get product info
    chrome.tabs.sendMessage(currentTab.id, {message: "get_product_info"}, function(response) {
      if (response) {
        displayCurrentProduct(response);
      } else {
        currentProductDiv.innerHTML = `
          <div class="error">
            Could not retrieve product information. Please refresh the page and try again.
          </div>
        `;
      }
    });
  });
  
  // Display current product
  function displayCurrentProduct(product) {
    let badgeClass = product.site === 'amazon' ? 'amazon-badge' : 'flipkart-badge';
    let badgeText = product.site === 'amazon' ? 'Amazon' : 'Flipkart';
    
    currentProductDiv.innerHTML = `
      <span class="site-badge ${badgeClass}">${badgeText}</span>
      ${product.image ? `<img src="${product.image}" class="product-image">` : ''}
      <div class="product-title">${product.title}</div>
      <div class="product-price">${product.price}</div>
      <div style="clear: both;"></div>
    `;
  }
  
  // Handle compare button click
  compareBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      
      // Send message to content script to get product info
      chrome.tabs.sendMessage(currentTab.id, {message: "get_product_info"}, function(response) {
        if (response && response.site === "amazon") {
          // Extract search keywords from product title
          const searchQuery = extractSearchKeywords(response.title);
          
          // Show loading state
          comparisonResultsDiv.innerHTML = `
            <div class="loading">
              Searching for similar products on Flipkart...
            </div>
          `;
          
          // Simulate API call to get Flipkart results (in a real extension, you'd use an actual API)
          setTimeout(() => {
            displayFlipkartResults(searchQuery, response);
            
            // Open Flipkart in a new tab
            const flipkartUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`;
            chrome.tabs.create({ url: flipkartUrl });
          }, 1500);
          
        } else if (response && response.site === "flipkart") {
          // Extract search keywords from product title
          const searchQuery = extractSearchKeywords(response.title);
          
          // Show loading state
          comparisonResultsDiv.innerHTML = `
            <div class="loading">
              Searching for similar products on Amazon...
            </div>
          `;
          
          // Simulate API call to get Amazon results
          setTimeout(() => {
            displayAmazonResults(searchQuery, response);
            
            // Open Amazon in a new tab
            const amazonUrl = `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}`;
            chrome.tabs.create({ url: amazonUrl });
          }, 1500);
          
        } else {
          comparisonResultsDiv.innerHTML = `
            <div class="error">
              Please navigate to a product page on Amazon or Flipkart first.
            </div>
          `;
        }
      });
    });
  });
  
  // Extract search keywords from product title
  function extractSearchKeywords(title) {
    return title
      .replace(/[^\w\s]/gi, '') // Remove special characters
      .replace(/\b(the|a|an|and|or|for|of|in|on|at|to|with|by|from|is|are|was|were|be|being|been|this|that|these|those|it|its|amazon|flipkart|online|shopping|buy)\b/gi, '')
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .split(' ')
      .slice(0, 5) // Take first 5 words
      .join(' ');
  }
  
  // Display Flipkart results (simulated)
  function displayFlipkartResults(searchQuery, originalProduct) {
    // Simulated Flipkart results
    const simulatedResults = [
      {
        title: `${searchQuery} - Premium Edition`,
        price: "₹" + (parseInt(originalProduct.price.replace(/\D/g, '')) + 2000).toLocaleString('en-IN'),
        image: "https://via.placeholder.com/50x50?text=F1",
        url: `https://www.flipkart.com/${searchQuery.replace(/\s+/g, '-')}-premium-edition/p/itm123`
      },
      {
        title: `${searchQuery} - Standard Version`,
        price: "₹" + (parseInt(originalProduct.price.replace(/\D/g, '')) - 1500).toLocaleString('en-IN'),
        image: "https://via.placeholder.com/50x50?text=F2",
        url: `https://www.flipkart.com/${searchQuery.replace(/\s+/g, '-')}-standard-version/p/itm456`
      },
      {
        title: `${searchQuery} - Budget Option`,
        price: "₹" + (parseInt(originalProduct.price.replace(/\D/g, '')) - 3000).toLocaleString('en-IN'),
        image: "https://via.placeholder.com/50x50?text=F3",
        url: `https://www.flipkart.com/${searchQuery.replace(/\s+/g, '-')}-budget-option/p/itm789`
      }
    ];
    
    let resultsHTML = `<h3>Similar products on Flipkart:</h3>`;
    
    simulatedResults.forEach(product => {
      resultsHTML += `
        <div class="result-item">
          <img src="${product.image}" class="result-image">
          <div class="result-info">
            <div class="result-title">${product.title}</div>
            <div class="result-price">${product.price}</div>
          </div>
          <button class="view-btn" data-url="${product.url}">View</button>
        </div>
      `;
    });
    
    comparisonResultsDiv.innerHTML = resultsHTML;
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-btn').forEach(button => {
      button.addEventListener('click', function() {
        chrome.tabs.create({ url: this.getAttribute('data-url') });
      });
    });
  }
  
  // Display Amazon results (simulated)
  function displayAmazonResults(searchQuery, originalProduct) {
    // Simulated Amazon results
    const simulatedResults = [
      {
        title: `${searchQuery} - Premium Edition`,
        price: "₹" + (parseInt(originalProduct.price.replace(/\D/g, '')) + 2500).toLocaleString('en-IN'),
        image: "https://via.placeholder.com/50x50?text=A1",
        url: `https://www.amazon.in/dp/${Math.random().toString(36).substring(2, 10)}`
      },
      {
        title: `${searchQuery} - Standard Version`,
        price: "₹" + (parseInt(originalProduct.price.replace(/\D/g, '')) - 1200).toLocaleString('en-IN'),
        image: "https://via.placeholder.com/50x50?text=A2",
        url: `https://www.amazon.in/dp/${Math.random().toString(36).substring(2, 10)}`
      },
      {
        title: `${searchQuery} - Budget Option`,
        price: "₹" + (parseInt(originalProduct.price.replace(/\D/g, '')) - 2800).toLocaleString('en-IN'),
        image: "https://via.placeholder.com/50x50?text=A3",
        url: `https://www.amazon.in/dp/${Math.random().toString(36).substring(2, 10)}`
      }
    ];
    
    let resultsHTML = `<h3>Similar products on Amazon:</h3>`;
    
    simulatedResults.forEach(product => {
      resultsHTML += `
        <div class="result-item">
          <img src="${product.image}" class="result-image">
          <div class="result-info">
            <div class="result-title">${product.title}</div>
            <div class="result-price">${product.price}</div>
          </div>
          <button class="view-btn" data-url="${product.url}">View</button>
        </div>
      `;
    });
    
    comparisonResultsDiv.innerHTML = resultsHTML;
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-btn').forEach(button => {
      button.addEventListener('click', function() {
        chrome.tabs.create({ url: this.getAttribute('data-url') });
      });
    });
  }
});


// ************************************************************************************************************************* */









