// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "get_product_info") {
    var productInfo = getProductInfo();
    sendResponse(productInfo);
  }
  return true;
});

// Function to get product info from current page
function getProductInfo() {
  try {
    var hostname = window.location.hostname;
    var title = "Title not found";
    var price = "Price not found";
    var url = window.location.href;
    var image = "";

    // Check if we're on Amazon
    if (hostname.includes("amazon.in")) {
      // Get product title from Amazon
      title = document.querySelector("#productTitle") ? 
              document.querySelector("#productTitle").textContent.trim() : 
              document.querySelector("h1") ? 
              document.querySelector("h1").textContent.trim() : 
              "Title not found";
      
      // Get product price from Amazon
      price = document.querySelector(".a-price-whole") ?
              "₹" + document.querySelector(".a-price-whole").textContent :
              document.querySelector(".a-price .a-offscreen") ?
              document.querySelector(".a-price .a-offscreen").textContent :
              "Price not found";
      
      // Get product image from Amazon
      image = document.querySelector("#landingImage") ?
              document.querySelector("#landingImage").src :
              document.querySelector(".a-dynamic-image") ?
              document.querySelector(".a-dynamic-image").src :
              "";
              
      return {
        site: "amazon",
        title: title,
        price: price,
        url: url,
        image: image
      };
    }
    // Check if we're on Flipkart
    else if (hostname.includes("flipkart.com")) {
      // Get product title from Flipkart
      title = document.querySelector(".VU-ZEz") ?
              document.querySelector(".VU-ZEz").textContent.trim() :
              document.querySelector(".B_NuCI") ?
              document.querySelector(".B_NuCI").textContent.trim() :
              "Title not found";
      
      // Get product price from Flipkart
                let priceElement =
                     document.querySelector(".Nx9bqj.CxhGGd") || // new Flipkart price class
                      document.querySelector("._30jeq3") ||       // older Flipkart price class
                      document.querySelector("._16Jk6d");         // alternate Flipkart class

         if (priceElement) {
               price = priceElement.textContent.replace(/\s+/g, ' ').trim();
               } else {
                 price = "Price not found";
              }
  
      
      // Get product image from Flipkart
      image = document.querySelector("._396cs4") ?
              document.querySelector("._396cs4").src :
              document.querySelector(".CXW8mj img") ?
              document.querySelector(".CXW8mj img").src :
              "";
              
      return {
        site: "flipkart",
        title: title,
        price: price,
        url: url,
        image: image
      };
    }
    else {
      return {
        site: "unknown",
        title: "Please visit Amazon or Flipkart product page",
        price: "",
        url: "",
        image: ""
      };
    }
  } catch (error) {
    console.error("Error getting product info:", error);
    return {
      site: "error",
      title: "Error: " + error.message,
      price: "",
      url: "",
      image: ""
    };
  }
}










// // Listen for messages from the popup
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.message === "get_product_info") {
//     var productInfo = getProductInfo();
//     sendResponse(productInfo);
//   } else if (request.message === "get_search_results") {
//     var searchResults = getSearchResults();
//     sendResponse(searchResults);
//   }
//   return true;
// });

// // =======================
// // Product Page Scraper
// // =======================
// function getProductInfo() {
//   try {
//     var hostname = window.location.hostname;
//     var title = "Title not found";
//     var price = "Price not found";
//     var url = window.location.href;
//     var image = "";

//     // Amazon product page
//     if (hostname.includes("amazon.in")) {
//       title = document.querySelector("#productTitle")
//         ? document.querySelector("#productTitle").textContent.trim()
//         : document.querySelector("h1")
//         ? document.querySelector("h1").textContent.trim()
//         : "Title not found";

//       price = document.querySelector(".a-price-whole")
//         ? "₹" + document.querySelector(".a-price-whole").textContent
//         : document.querySelector(".a-price .a-offscreen")
//         ? document.querySelector(".a-price .a-offscreen").textContent
//         : "Price not found";

//       image = document.querySelector("#landingImage")
//         ? document.querySelector("#landingImage").src
//         : document.querySelector(".a-dynamic-image")
//         ? document.querySelector(".a-dynamic-image").src
//         : "";

//       return { site: "amazon", title, price, url, image };
//     }

//     // Flipkart product page
//     else if (hostname.includes("flipkart.com")) {
//       title = document.querySelector(".VU-ZEz")
//         ? document.querySelector(".VU-ZEz").textContent.trim()
//         : document.querySelector(".B_NuCI")
//         ? document.querySelector(".B_NuCI").textContent.trim()
//         : "Title not found";

//       let priceElement =
//         document.querySelector(".Nx9bqj.CxhGGd") ||
//         document.querySelector("._30jeq3") ||
//         document.querySelector("._16Jk6d");

//       if (priceElement) {
//         price = priceElement.textContent.replace(/\s+/g, " ").trim();
//       } else {
//         price = "Price not found";
//       }

//      // Get product image from Flipkart
//          let imgElement = document.querySelector("img.DByuf4");

//             if (!imgElement) {
//                  // fallback selectors for other layouts
//                    imgElement = document.querySelector("._396cs4") || 
//                document.querySelector(".CXW8mj img");
//               }

// image = imgElement ? (imgElement.src || imgElement.getAttribute("srcset")) : "";


//       return { site: "flipkart", title, price, url, image };
//     }

//     // Other sites
//     else {
//       return {
//         site: "unknown",
//         title: "Please visit Amazon or Flipkart product page",
//         price: "",
//         url: "",
//         image: "",
//       };
//     }
//   } catch (error) {
//     console.error("Error getting product info:", error);
//     return {
//       site: "error",
//       title: "Error: " + error.message,
//       price: "",
//       url: "",
//       image: "",
//     };
//   }
// }

// // =======================
// // Search Results Scraper
// // =======================
// function getSearchResults() {
//   let hostname = window.location.hostname;
//   let products = [];

//   try {
//     // --------------------
//     // Amazon Search Results
//     // --------------------
//     if (hostname.includes("amazon.in")) {
//       let cards = document.querySelectorAll(
//         "div.s-main-slot div.s-result-item[data-asin]"
//       );

//       cards.forEach((card) => {
//         let titleEl = card.querySelector(
//           "a.a-link-normal.s-line-clamp-2.s-line-clamp-3-for-col-12.s-link-style.a-text-normal"
//         );
//         let priceEl = card.querySelector("span.a-price span.a-offscreen");
//         let imgEl = card.querySelector("img.s-image");

//         if (titleEl && priceEl && imgEl) {
//           products.push({
//             title: titleEl.innerText.trim(),
//             price: priceEl.innerText.trim(),
//             image: imgEl.src,
//             url: titleEl.href,
//           });
//         }
//       });

//       return { site: "amazon", products };
//     }

//     // --------------------
//     // Flipkart Search Results
//     // --------------------
//     else if (hostname.includes("flipkart.com")) {
//       let productCards = document.querySelectorAll("div.tUxRFH");

//       productCards.forEach((card) => {
//         let titleEl = card.querySelector(".KzDlHZ");
//         let priceEl = card.querySelector(".Nx9bqj");
//         let imgEl = card.querySelector("img.DByuf4");
//         let linkEl = card.querySelector("a.CGtC98");

//         if (titleEl && priceEl) {
//           products.push({
//             title: titleEl.textContent.trim(),
//             price: priceEl.textContent.replace(/[^\d]/g, ""), // keep only numbers
//             image: imgEl ? imgEl.src : "",
//             url: linkEl
//               ? "https://www.flipkart.com" + linkEl.getAttribute("href")
//               : "",
//           });
//         }
//       });

//       return { site: "flipkart", products };
//     }

//     // Other sites
//     else {
//       return { site: "unknown", products: [] };
//     }
//   } catch (error) {
//     console.error("Error scraping search results:", error);
//     return { site: "error", products: [], error: error.message };
//   }
// }
