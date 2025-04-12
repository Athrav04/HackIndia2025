(function () {
    console.log("Content script loaded");

    // Create and inject CSS styles
    const styles = document.createElement('style');
    styles.textContent = `
        .eco-square {
            position: fixed;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            border-radius: 12px 0 0 12px;
            cursor: pointer;
            box-shadow: -4px 4px 15px rgba(46, 204, 113, 0.3);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            transition: all 0.3s ease;
        }

        .eco-square:hover {
            width: 70px;
            box-shadow: -6px 4px 20px rgba(46, 204, 113, 0.4);
        }

        .eco-icon {
            width: 30px;
            height: 30px;
            fill: white;
        }

        .eco-popup {
            position: fixed;
            right: -400px;
            top: 50%;
            transform: translateY(-50%);
            width: 350px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            padding: 20px;
            z-index: 999998;
            transition: right 0.3s ease;
        }

        .eco-popup.active {
            right: 80px;
        }

        .eco-popup h2 {
            color: #2c3e50;
            font-size: 20px;
            margin: 0 0 15px 0;
            font-family: system-ui, -apple-system, sans-serif;
        }

        .eco-product {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .eco-product img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .eco-product h3 {
            font-size: 16px;
            margin: 5px 0;
            color: #2c3e50;
        }

        .eco-product p {
            font-size: 14px;
            color: #34495e;
            margin: 5px 0;
        }

        .eco-product .price {
            color: #27ae60;
            font-size: 18px;
            font-weight: bold;
        }

        .eco-product .buy-button {
            display: block;
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
            text-align: center;
            text-decoration: none;
            padding: 10px;
            border-radius: 6px;
            font-weight: 500;
            transition: transform 0.2s ease;
        }

        .eco-product .buy-button:hover {
            transform: translateY(-2px);
        }

        .eco-reviews {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #f39c12;
        }

        /* Skeleton loading styles */
        .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 4px;
        }

        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        .skeleton-image {
            width: 100%;
            height: 200px;
            border-radius: 8px;
        }

        .skeleton-title {
            height: 24px;
            width: 80%;
            margin: 10px 0;
        }

        .skeleton-text-long {
            height: 16px;
            width: 100%;
            margin: 8px 0;
        }

        .skeleton-text-short {
            height: 16px;
            width: 60%;
            margin: 8px 0;
        }

        .skeleton-button {
            height: 40px;
            width: 100%;
            margin-top: 15px;
        }
    `;
    document.head.appendChild(styles);

    // Create the floating square with an eco-friendly icon
    const square = document.createElement("div");
    square.className = "eco-square";
    square.innerHTML = `
        <svg class="eco-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-4H7l5-5 5 5h-2v4h-2v-3h-2v3z"/>
        </svg>
    `;
    document.body.appendChild(square);

    // Create the product popup window
    const popup = document.createElement("div");
    popup.className = "eco-popup";
    popup.innerHTML = `
        <h2>Eco-Friendly Alternative</h2>
        <div id="eco-product-container"></div>
    `;
    document.body.appendChild(popup);

    // Handle hover interactions
    let popupTimeout;
    square.addEventListener("mouseenter", () => {
        console.log("Square mouseenter");
        clearTimeout(popupTimeout);
        popup.classList.add("active");
    });

    popup.addEventListener("mouseenter", () => {
        console.log("Popup mouseenter");
        clearTimeout(popupTimeout);
    });

    const hidePopup = () => {
        console.log("Hide popup triggered");
        popupTimeout = setTimeout(() => {
            popup.classList.remove("active");
        }, 300);
    };

    square.addEventListener("mouseleave", hidePopup);
    popup.addEventListener("mouseleave", hidePopup);

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("Received message:", message);
        
        if (message.action === "check_keywords") {
            const productContainer = document.getElementById("eco-product-container");
            console.log("Matching product:", message.matchingProduct);
            
            if (message.matchingProduct) {
                // Show the square
                square.style.display = "flex";
                
                // Show loading skeleton
                productContainer.innerHTML = `
                    <div class="eco-product">
                        <div class="skeleton skeleton-image"></div>
                        <div class="skeleton skeleton-title"></div>
                        <div class="skeleton skeleton-text-long"></div>
                        <div class="skeleton skeleton-text-short"></div>
                        <div class="skeleton skeleton-text-long"></div>
                        <div class="skeleton skeleton-text-short"></div>
                        <div class="skeleton skeleton-button"></div>
                    </div>
                `;

                const product = message.matchingProduct;
                console.log("Product data received:", product);
                
                // Function to render product content
                const renderProduct = (includeImage = true) => {
                    try {
                        // Parse the image URLs from the string array
                        const imageUrls = JSON.parse(product.image_urls.replace(/'/g, '"'));
                        console.log("Parsed image URLs:", imageUrls);
                        const firstImage = imageUrls[0];
                        
                        const imageHtml = includeImage ? `<img src="${firstImage}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;" />` : '';
                        
                        productContainer.innerHTML = `
                            <div class="eco-product">
                                ${imageHtml}
                                <h3>${product.name}</h3>
                                <p>${product.description}</p>
                                <p><strong>Brand:</strong> ${product.brand}</p>
                                <p class="price">$${product.price}</p>
                                <a href="http://localhost:3001/product/${product._id}" class="buy-button" target="_blank">View Product</a>
                            </div>
                        `;
                    } catch (error) {
                        console.error("Error rendering product:", error);
                        productContainer.innerHTML = `
                            <div class="eco-product">
                                <h3>${product.name}</h3>
                                <p>${product.description}</p>
                                <p><strong>Brand:</strong> ${product.brand}</p>
                                <p class="price">$${product.price}</p>
                                <a href="${product.url}" class="buy-button" target="_blank">View Product</a>
                            </div>
                        `;
                    }
                };

                // Try to load the image first
                try {
                    const imageUrls = JSON.parse(product.image_urls.replace(/'/g, '"'));
                    const firstImage = imageUrls[0];
                    console.log("Attempting to load image:", firstImage);
                    
                    const img = new Image();
                    
                    img.onload = () => {
                        console.log("Product image loaded successfully:", firstImage);
                        setTimeout(() => renderProduct(true), 800);
                    };

                    img.onerror = (error) => {
                        console.error("Failed to load product image:", firstImage, error);
                        // Render without image after delay
                        setTimeout(() => renderProduct(false), 800);
                    };

                    // Start loading the image
                    img.src = firstImage;
                    
                    // Set referrer policy and crossOrigin
                    img.referrerPolicy = "no-referrer";
                    img.crossOrigin = "anonymous";
                } catch (error) {
                    console.error("Error processing image URLs:", error);
                    setTimeout(() => renderProduct(false), 800);
                }

            } else {
                console.log("No matching product found");
                square.style.display = "none";
                popup.classList.remove("active");
            }
        }
    });

    // Log that initialization is complete
    console.log("Content script initialization complete");
})();
