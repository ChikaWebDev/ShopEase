
/* =====================================
   SHOEASE - MARKETPLACE JAVASCRIPT
   Ratings, Reviews and Wishlist Edition
===================================== */

const EXCHANGE_RATE = 1500; // Demonstration rate, not live.

const products = [
 {id:1,name:"Smartphone Pro",category:"Electronics",price:450000,description:"A modern smartphone with a beautiful display, excellent camera and smooth performance.",image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700",rating:4.8,reviews:125},
 {id:2,name:"Smartwatch Series",category:"Electronics",price:85000,description:"Track your daily activity, receive notifications and stay connected with this stylish smartwatch.",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",rating:4.5,reviews:86},
 {id:3,name:"Wireless Earbuds",category:"Electronics",price:45000,description:"Enjoy your favourite music and calls with compact wireless earbuds.",image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=700",rating:4.9,reviews:210},
 {id:4,name:"Laptop Computer",category:"Electronics",price:750000,description:"A versatile laptop for studying, working, browsing and everyday productivity.",image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700",rating:4.6,reviews:54},
 {id:5,name:"Portable Bluetooth Speaker",category:"Electronics",price:55000,description:"A portable speaker for enjoying music at home or while travelling.",image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=700",rating:4.7,reviews:98},
 {id:6,name:"Women's Casual Dress",category:"Fashion",price:28000,description:"A comfortable and stylish dress suitable for casual outings and everyday wear.",image:"https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=700",rating:4.8,reviews:125},
 {id:7,name:"Classic Men's Shirt",category:"Fashion",price:18000,description:"A smart and comfortable shirt that works well for casual and formal occasions.",image:"https://images.unsplash.com/photo-1603252109303-2751441dd157?w=700",rating:4.5,reviews:86},
 {id:8,name:"Fashion Sneakers",category:"Fashion",price:42000,description:"Everyday sneakers designed for comfort and a clean modern look.",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",rating:4.9,reviews:210},
 {id:9,name:"Everyday Handbag",category:"Fashion",price:35000,description:"A practical handbag with a stylish design for everyday use.",image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",rating:4.6,reviews:54},
 {id:10,name:"Modern Table Lamp",category:"Home",price:22000,description:"Add a warm and welcoming touch to your bedroom, study or living space.",image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700",rating:4.7,reviews:98},
 {id:11,name:"Kitchen Blender",category:"Home",price:65000,description:"A useful kitchen appliance for preparing smoothies, sauces and other blends.",image:"https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=700",rating:4.8,reviews:125},
 {id:12,name:"Decorative Cushion",category:"Home",price:12000,description:"A soft decorative cushion to make your living space more comfortable.",image:"https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=700",rating:4.5,reviews:86},
 {id:13,name:"Skincare Essentials",category:"Beauty",price:25000,description:"A simple skincare collection for your everyday personal care routine.",image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700",rating:4.9,reviews:210},
 {id:14,name:"Beauty Makeup Set",category:"Beauty",price:32000,description:"A collection of makeup essentials for creating different everyday looks.",image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700",rating:4.6,reviews:54},
 {id:15,name:"Fitness Dumbbells",category:"Sports",price:30000,description:"A pair of exercise dumbbells for strength training and home workouts.",image:"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=700",rating:4.7,reviews:98}
];

const $ = id => document.getElementById(id);

const productGrid=$("productGrid"),categoryList=$("categoryList");
const searchInput=$("searchInput"),searchBtn=$("searchBtn"),sortSelect=$("sortSelect");
const cartItems=$("cartItems"),cartCount=$("cartCount"),cartTotal=$("cartTotal"),checkoutBtn=$("checkoutBtn");
const currencySelect=$("currencySelect"),themeToggle=$("themeToggle");
const wishlistItems=$("wishlistItems"),wishlistCount=$("wishlistCount");
const productModal=$("productModal"),modalBackdrop=$("modalBackdrop"),modalClose=$("modalClose");
const modalImage=$("modalImage"),modalCategory=$("modalCategory"),modalTitle=$("modalTitle");
const modalDescription=$("modalDescription"),modalPrice=$("modalPrice"),modalAddToCart=$("modalAddToCart");

function loadArray(key) {
    try {
        const value=JSON.parse(localStorage.getItem(key)) || [];
        return Array.isArray(value) ? value : [];
    } catch(error) {
        return [];
    }
}

let cart=loadArray("shopEaseCart");

let wishlist=loadArray("shopEaseWishlist")
    .map(Number)
    .filter(id=>products.some(product=>product.id===id));

let customerReviews=loadArray("shopEaseProductReviews");

let selectedCategory="All";
let currentSearch="";
let selectedProductId=null;
let currentCurrency="NGN";

function getProduct(id) {
    return products.find(product=>product.id===Number(id));
}

function formatCurrency(amount) {
    const converted=currentCurrency==="USD"?amount/EXCHANGE_RATE:amount;

    return new Intl.NumberFormat("en-NG",{
        style:"currency",
        currency:currentCurrency,
        maximumFractionDigits:2
    }).format(converted);
}

function saveCart() {
    localStorage.setItem("shopEaseCart",JSON.stringify(cart));
}

function saveWishlist() {
    localStorage.setItem("shopEaseWishlist",JSON.stringify(wishlist));
}

function saveReviews() {
    localStorage.setItem("shopEaseProductReviews",JSON.stringify(customerReviews));
}

/* =====================================
   RATINGS AND REVIEWS
===================================== */

function getProductReviews(productId) {
    return customerReviews.filter(
        review=>Number(review.productId)===Number(productId)
    );
}

function getRatingStats(product) {
    const reviews=getProductReviews(product.id);

    const addedTotal=reviews.reduce(
        (sum,review)=>sum+Number(review.rating),0
    );

    const count=Number(product.reviews)+reviews.length;

    return {
        rating:count?
            ((Number(product.rating)*Number(product.reviews)+addedTotal)/count):0,
        count
    };
}

function createRatingDisplay(product) {
    const stats=getRatingStats(product);

    const wrapper=document.createElement("div");
    wrapper.className="product-rating";

    const stars=document.createElement("span");
    stars.className="rating-stars";

    stars.textContent=
        "★".repeat(Math.round(stats.rating))+
        "☆".repeat(5-Math.round(stats.rating));

    const label=document.createElement("span");
    label.className="rating-text";
    label.textContent=`${stats.rating.toFixed(1)} (${stats.count} reviews)`;

    wrapper.append(stars,label);

    return wrapper;
}

/* Create the reviews section inside the product modal */

const reviewsSection=document.createElement("section");
reviewsSection.className="product-reviews";

const reviewsHeading=document.createElement("h3");
reviewsHeading.textContent="Customer Ratings & Reviews";

const ratingSummary=document.createElement("div");
ratingSummary.className="review-summary";

const reviewList=document.createElement("div");
reviewList.className="review-list";

const reviewForm=document.createElement("form");
reviewForm.className="review-form";

const formHeading=document.createElement("h4");
formHeading.textContent="Write a Review";

const ratingLabel=document.createElement("label");
ratingLabel.textContent="Your rating";

const ratingSelect=document.createElement("select");
ratingSelect.className="review-rating-select";
ratingSelect.required=true;

[
    ["5","★★★★★ - Excellent"],
    ["4","★★★★ - Very Good"],
    ["3","★★★ - Good"],
    ["2","★★ - Fair"],
    ["1","★ - Poor"]
].forEach(([value,label])=>{
    const option=document.createElement("option");
    option.value=value;
    option.textContent=label;
    ratingSelect.append(option);
});

ratingLabel.append(ratingSelect);

const reviewLabel=document.createElement("label");
reviewLabel.textContent="Your review";

const reviewTextarea=document.createElement("textarea");
reviewTextarea.className="review-textarea";
reviewTextarea.required=true;
reviewTextarea.maxLength=500;
reviewTextarea.rows=4;
reviewTextarea.placeholder="Share your experience with this product...";

reviewLabel.append(reviewTextarea);

const reviewSubmit=document.createElement("button");
reviewSubmit.type="submit";
reviewSubmit.className="submit-review-button";
reviewSubmit.textContent="Submit Review";

reviewForm.append(
    formHeading,
    ratingLabel,
    reviewLabel,
    reviewSubmit
);

reviewsSection.append(
    reviewsHeading,
    ratingSummary,
    reviewList,
    reviewForm
);

modalDescription.insertAdjacentElement("afterend",reviewsSection);

function displayProductReviews(productId) {
    const product=getProduct(productId);

    if(!product)return;

    const stats=getRatingStats(product);
    const reviews=getProductReviews(productId);

    ratingSummary.innerHTML="";

    const average=document.createElement("strong");
    average.className="review-average";
    average.textContent=stats.rating.toFixed(1)+" / 5";

    const stars=document.createElement("span");
    stars.className="rating-stars";

    stars.textContent=
        "★".repeat(Math.round(stats.rating))+
        "☆".repeat(5-Math.round(stats.rating));

    const count=document.createElement("p");
    count.textContent=`${stats.count} total ratings`;

    ratingSummary.append(average,stars,count);

    reviewList.innerHTML="";

    if(!reviews.length) {
        const empty=document.createElement("p");
        empty.className="no-reviews";
        empty.textContent="No written customer reviews yet. Be the first to share your experience!";

        reviewList.append(empty);
        return;
    }

    reviews.slice().reverse().forEach(review=>{
        const card=document.createElement("article");
        card.className="review-card";

        const starsLine=document.createElement("div");
        starsLine.className="rating-stars";

        starsLine.textContent=
            "★".repeat(Number(review.rating))+
            "☆".repeat(5-Number(review.rating));

        const author=document.createElement("strong");
        author.textContent="ShopEase Customer";

        const date=document.createElement("small");
        date.textContent=review.date;

        const message=document.createElement("p");
        message.textContent=review.text;

        card.append(starsLine,author,date,message);
        reviewList.append(card);
    });
}

reviewForm.addEventListener("submit",event=>{
    event.preventDefault();

    if(selectedProductId===null)return;

    const text=reviewTextarea.value.trim();
    const rating=Number(ratingSelect.value);

    if(!text) {
        alert("Please write a review before submitting.");
        return;
    }

    customerReviews.push({
        productId:selectedProductId,
        rating,
        text,
        date:new Date().toLocaleDateString()
    });

    saveReviews();

    reviewTextarea.value="";
    ratingSelect.value="5";

    displayProductReviews(selectedProductId);
    displayProducts();

    alert("Thank you! Your review has been added.");
});

/* =====================================
   WISHLIST
===================================== */

function isInWishlist(id) {
    return wishlist.includes(Number(id));
}

function toggleWishlist(id) {
    id=Number(id);

    wishlist=isInWishlist(id)
        ?wishlist.filter(savedId=>savedId!==id)
        :[...wishlist,id];

    saveWishlist();

    displayWishlist();
    displayProducts();
}

function displayWishlist() {
    wishlistItems.innerHTML="";

    wishlistCount.textContent=wishlist.length;

    const savedProducts=wishlist.map(getProduct).filter(Boolean);

    if(!savedProducts.length) {
        const empty=document.createElement("div");
        empty.className="wishlist-empty";

        const heading=document.createElement("h3");
        heading.textContent="Your Wishlist is empty ❤️";

        const message=document.createElement("p");
        message.textContent="Browse our products and save your favourites by clicking the heart button.";

        empty.append(heading,message);
        wishlistItems.append(empty);

        return;
    }

    savedProducts.forEach(product=>{
        const card=document.createElement("article");
        card.className="product-card";

        const imageWrap=document.createElement("div");
        imageWrap.className="product-image-wrap";

        const image=document.createElement("img");
        image.src=product.image;
        image.alt=product.name;
        image.loading="lazy";

        imageWrap.append(image);

        const info=document.createElement("div");
        info.className="product-info";

        const category=document.createElement("span");
        category.className="product-category";
        category.textContent=product.category;

        const name=document.createElement("h3");
        name.textContent=product.name;

        const rating=createRatingDisplay(product);

        const price=document.createElement("strong");
        price.className="product-price";
        price.textContent=formatCurrency(product.price);

        const actions=document.createElement("div");
        actions.className="wishlist-actions";

        const add=document.createElement("button");
        add.className="wishlist-cart-button";
        add.textContent="Add to Cart";
        add.addEventListener("click",()=>addToCart(product.id));

        const remove=document.createElement("button");
        remove.className="wishlist-remove-button";
        remove.textContent="Remove";
        remove.addEventListener("click",()=>toggleWishlist(product.id));

        actions.append(add,remove);

        info.append(category,name,rating,price,actions);

        card.append(imageWrap,info);

        wishlistItems.append(card);
    });
}

/* =====================================
   CATEGORIES, SEARCH AND SORT
===================================== */

function displayCategories() {
    categoryList.innerHTML="";

    ["All","Electronics","Fashion","Home","Beauty","Sports"].forEach(category=>{
        const button=document.createElement("button");

        button.className=
            "category-button"+
            (category===selectedCategory?" active":"");

        button.textContent=category;

        button.addEventListener("click",()=>{
            selectedCategory=category;
            displayCategories();
            displayProducts();
        });

        categoryList.append(button);
    });
}

function getVisibleProducts() {
    let list=[...products];

    if(selectedCategory!=="All") {
        list=list.filter(p=>p.category===selectedCategory);
    }

    if(currentSearch) {
        const term=currentSearch.toLowerCase();

        list=list.filter(p=>
            p.name.toLowerCase().includes(term)||
            p.category.toLowerCase().includes(term)||
            p.description.toLowerCase().includes(term)
        );
    }

    if(sortSelect.value==="low-high") {
        list.sort((a,b)=>a.price-b.price);
    }
    else if(sortSelect.value==="high-low") {
        list.sort((a,b)=>b.price-a.price);
    }
    else if(sortSelect.value==="name") {
        list.sort((a,b)=>a.name.localeCompare(b.name));
    }

    return list;
}

function displayProducts() {
    const list=getVisibleProducts();

    productGrid.innerHTML="";

    $("resultsText").textContent=`${list.length} product(s) found`;

    if(!list.length) {
        const empty=document.createElement("div");
        empty.className="no-products";

        const heading=document.createElement("h3");
        heading.textContent="No products found";

        const message=document.createElement("p");
        message.textContent="Try another search or choose a different category.";

        empty.append(heading,message);
        productGrid.append(empty);

        return;
    }

    list.forEach(product=>{
        const card=document.createElement("article");
        card.className="product-card";

        const imageWrap=document.createElement("div");
        imageWrap.className="product-image-wrap";

        const image=document.createElement("img");
        image.src=product.image;
        image.alt=product.name;
        image.loading="lazy";

        imageWrap.append(image);

        const info=document.createElement("div");
        info.className="product-info";

        const category=document.createElement("span");
        category.className="product-category";
        category.textContent=product.category;

        const name=document.createElement("h3");
        name.textContent=product.name;

        const description=document.createElement("p");
        description.className="product-description";
        description.textContent=product.description;

        const rating=createRatingDisplay(product);

        const bottom=document.createElement("div");
        bottom.className="product-card-bottom";

        const price=document.createElement("strong");
        price.className="product-price";
        price.textContent=formatCurrency(product.price);

        bottom.append(price);

        const actions=document.createElement("div");
        actions.className="product-actions";

        const favorite=document.createElement("button");

        favorite.type="button";

        favorite.className=
            "wishlist-toggle"+
            (isInWishlist(product.id)?" is-saved":"");

        favorite.textContent=isInWishlist(product.id)?"♥":"♡";

        favorite.setAttribute(
            "aria-label",
            isInWishlist(product.id)?"Remove from Wishlist":"Add to Wishlist"
        );

        favorite.setAttribute(
            "aria-pressed",
            String(isInWishlist(product.id))
        );

        favorite.addEventListener(
            "click",
            ()=>toggleWishlist(product.id)
        );

        const details=document.createElement("button");
        details.type="button";
        details.className="details-button";
        details.textContent="View Details";

        details.addEventListener(
            "click",
            ()=>openProductModal(product.id)
        );

        const add=document.createElement("button");
        add.type="button";
        add.className="add-to-cart";
        add.textContent="Add to Cart";

        add.addEventListener(
            "click",
            ()=>addToCart(product.id)
        );

        actions.append(favorite,details,add);

        info.append(category,name,description,rating,bottom,actions);

        card.append(imageWrap,info);

        productGrid.append(card);
    });
}

function performSearch() {
    currentSearch=searchInput.value.trim();
    displayProducts();
}

searchBtn.addEventListener("click",performSearch);

searchInput.addEventListener("input",performSearch);

searchInput.addEventListener("keydown",event=>{
    if(event.key==="Enter")performSearch();
});

sortSelect.addEventListener("change",displayProducts);

/* =====================================
   SHOPPING CART
===================================== */

function addToCart(productId) {
    const id=Number(productId);

    const existing=cart.find(item=>Number(item.id)===id);

    if(existing) {
        existing.quantity=Number(existing.quantity)+1;
    }
    else {
        cart.push({id,quantity:1});
    }

    saveCart();
    displayCart();
}

function changeQuantity(productId,amount) {
    const item=cart.find(
        entry=>Number(entry.id)===Number(productId)
    );

    if(!item)return;

    item.quantity=Number(item.quantity)+amount;

    if(item.quantity<=0) {
        cart=cart.filter(
            entry=>Number(entry.id)!==Number(productId)
        );
    }

    saveCart();
    displayCart();
}

function removeFromCart(productId) {
    cart=cart.filter(
        item=>Number(item.id)!==Number(productId)
    );

    saveCart();
    displayCart();
}

function displayCart() {
    cartItems.innerHTML="";

    let total=0;
    let quantityTotal=0;

    cart.forEach(item=>{
        const product=getProduct(item.id);
        const quantity=Number(item.quantity);

        if(!product||!Number.isFinite(quantity)||quantity<1)return;

        const itemTotal=product.price*quantity;

        total+=itemTotal;
        quantityTotal+=quantity;

        const row=document.createElement("div");
        row.className="cart-item";

        const image=document.createElement("img");
        image.src=product.image;
        image.alt=product.name;

        const info=document.createElement("div");
        info.className="cart-item-info";

        const name=document.createElement("h3");
        name.textContent=product.name;

        const unit=document.createElement("p");
        unit.textContent=formatCurrency(product.price)+" each";

        info.append(name,unit);

        const controls=document.createElement("div");
        controls.className="quantity-controls";

        const minus=document.createElement("button");
        minus.type="button";
        minus.textContent="−";
        minus.setAttribute("aria-label","Decrease quantity");

        minus.addEventListener(
            "click",
            ()=>changeQuantity(product.id,-1)
        );

        const quantitySpan=document.createElement("span");
        quantitySpan.textContent=quantity;

        const plus=document.createElement("button");
        plus.type="button";
        plus.textContent="+";
        plus.setAttribute("aria-label","Increase quantity");

        plus.addEventListener(
            "click",
            ()=>changeQuantity(product.id,1)
        );

        controls.append(minus,quantitySpan,plus);

        const priceArea=document.createElement("div");
        priceArea.className="cart-item-price";

        const itemPrice=document.createElement("strong");
        itemPrice.textContent=formatCurrency(itemTotal);

        const remove=document.createElement("button");
        remove.type="button";
        remove.className="remove-btn";
        remove.textContent="Remove";

        remove.addEventListener(
            "click",
            ()=>removeFromCart(product.id)
        );

        priceArea.append(itemPrice,remove);

        row.append(image,info,controls,priceArea);

        cartItems.append(row);
    });

    if(!cartItems.children.length) {
        const empty=document.createElement("div");
        empty.className="cart-empty";

        const heading=document.createElement("h3");
        heading.textContent="Your cart is empty 🛒";

        const message=document.createElement("p");
        message.textContent="Explore our products and add something you love.";

        empty.append(heading,message);
        cartItems.append(empty);
    }

    cartCount.textContent=quantityTotal;
    cartTotal.textContent=formatCurrency(total);
}

/* =====================================
   PRODUCT DETAILS MODAL
===================================== */

function openProductModal(productId) {
    const product=getProduct(productId);

    if(!product)return;

    selectedProductId=product.id;

    modalImage.src=product.image;
    modalImage.alt=product.name;

    modalCategory.textContent=product.category;
    modalTitle.textContent=product.name;

    modalDescription.textContent=product.description;
    modalPrice.textContent=formatCurrency(product.price);

    displayProductReviews(product.id);

    productModal.classList.add("open");
    productModal.setAttribute("aria-hidden","false");

    document.body.style.overflow="hidden";
}

function closeProductModal() {
    productModal.classList.remove("open");

    productModal.setAttribute("aria-hidden","true");

    document.body.style.overflow="";

    selectedProductId=null;
}

modalClose.addEventListener("click",closeProductModal);

modalBackdrop.addEventListener("click",closeProductModal);

document.addEventListener("keydown",event=>{
    if(
        event.key==="Escape"&&
        productModal.classList.contains("open")
    ) {
        closeProductModal();
    }
});

modalAddToCart.addEventListener("click",()=>{
    if(selectedProductId!==null) {
        addToCart(selectedProductId);
        closeProductModal();
    }
});

/* =====================================
   CURRENCY AND THEME
===================================== */

currencySelect.addEventListener("change",()=>{
    currentCurrency=currencySelect.value;

    displayProducts();
    displayCart();
    displayWishlist();

    if(selectedProductId!==null) {
        const product=getProduct(selectedProductId);

        if(product) {
            modalPrice.textContent=formatCurrency(product.price);
        }
    }
});

function applyTheme(theme) {
    document.body.classList.toggle(
        "dark-theme",
        theme==="dark"
    );

    themeToggle.textContent=
        theme==="dark"?"☀️ Light mode":"🌙 Dark mode";
}

let savedTheme=localStorage.getItem("shopEaseTheme")||"light";

applyTheme(savedTheme);

themeToggle.addEventListener("click",()=>{
    const next=document.body.classList.contains("dark-theme")
        ?"light"
        :"dark";

    localStorage.setItem("shopEaseTheme",next);

    applyTheme(next);
});

/* =====================================
   DEMO CHECKOUT
===================================== */

checkoutBtn.addEventListener("click",()=>{
    if(!cart.length) {
        alert("Your cart is empty. Add some products first!");
        return;
    }

    const total=cart.reduce((sum,item)=>{
        const product=getProduct(item.id);

        return product
            ?sum+product.price*Number(item.quantity)
            :sum;
    },0);

    alert(
        "Thank you for shopping with ShopEase!\n\n"+
        "Your demo order total is "+formatCurrency(total)+".\n\n"+
        "This is a demonstration only. No payment has been processed."
    );
});

/* =====================================
   INITIALIZE SHOP
===================================== */

$("currentYear").textContent=new Date().getFullYear();

displayCategories();
displayProducts();
displayCart();
displayWishlist();
