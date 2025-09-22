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