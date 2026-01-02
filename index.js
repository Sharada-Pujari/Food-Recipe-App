let food = document.querySelector('.food');

let indian = document.querySelector('#indian');
let american = document.querySelector('#american');
let canadian = document.querySelector('#canadian');
let thai = document.querySelector('#thai');
let british = document.querySelector('#british');
let russian = document.querySelector('#russian');

let recipe;
let recipeModal;

// Initialize modal when page loads
window.addEventListener('DOMContentLoaded', () => {
    recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
    fetchData('indian'); // Load Indian dishes by default
});

// Fetch dishes by area/category
const fetchData = async (area) => {
    try {
        const api = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        const data = await api.json();
        recipe = data.meals;
        showData(recipe);
    } catch (error) {
        console.error('Error fetching data:', error);
        food.innerHTML = '<div class="text-center text-danger">Error loading dishes. Please try again.</div>';
    }
};

// Search recipe functionality
const searchRecipe = async () => {
    let input = document.querySelector('#search');
    input.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            let inputValue = input.value.trim();
            if (!inputValue) return;
            
            try {
                const api = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`);
                const data = await api.json();
                recipe = data.meals;
                
                if (recipe) {
                    showData(recipe);
                } else {
                    food.innerHTML = '<div class="text-center text-warning">No dishes found. Try another search.</div>';
                }
            } catch (error) {
                console.error('Error searching:', error);
            }
        }
    });
};
searchRecipe();

// Display dishes in a grid
let showData = (recipe) => {
    if (!recipe) {
        food.innerHTML = '<div class="text-center text-warning">No dishes found.</div>';
        return;
    }
    
    food.innerHTML = recipe.map((meal) =>
        `<div class="col-md-6 col-lg-4 col-xl-3 mb-4">
            <div class="card bg-dark text-light h-100 shadow-lg" style="cursor: pointer;" onclick="showRecipeDetails('${meal.idMeal}')">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}" style="height: 250px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <div class="mt-3 text-center">
                        <span class="text-primary">Click for recipe →</span>
                    </div>
                </div>
            </div>
        </div>`
    ).join("");
}

// Fetch and show detailed recipe
async function showRecipeDetails(mealId) {
    try {
        const api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await api.json();
        const meal = data.meals[0];
        
        // Extract ingredients and measurements
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push(`${measure} ${ingredient}`);
            }
        }
        
        // Populate modal
        document.getElementById('recipeTitle').textContent = meal.strMeal;
        document.getElementById('recipeBody').innerHTML = `
            <img src="${meal.strMealThumb}" class="img-fluid rounded mb-3" alt="${meal.strMeal}">
            
            <div class="row mb-3">
                <div class="col-6">
                    <strong>Category:</strong> ${meal.strCategory}
                </div>
                <div class="col-6">
                    <strong>Area:</strong> ${meal.strArea}
                </div>
            </div>
            
            ${meal.strTags ? `
            <div class="mb-3">
                <strong>Tags:</strong> 
                ${meal.strTags.split(',').map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}
            </div>
            ` : ''}
            
            <h5 class="mt-4 mb-3">🥘 Ingredients</h5>
            <ul class="list-group list-group-flush mb-4">
                ${ingredients.map(ing => `
                    <li class="list-group-item bg-dark text-light border-secondary">
                        • ${ing}
                    </li>
                `).join('')}
            </ul>
            
            <h5 class="mb-3">👨‍🍳 Instructions</h5>
            <div class="card bg-secondary text-light p-3">
                <p style="white-space: pre-line;">${meal.strInstructions}</p>
            </div>
            
            ${meal.strYoutube ? `
            <div class="mt-4 text-center">
                <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">
                    📺 Watch Video Tutorial
                </a>
            </div>
            ` : ''}
            
            ${meal.strSource ? `
            <div class="mt-3 text-center">
                <a href="${meal.strSource}" target="_blank" class="btn btn-outline-primary">
                    🌐 View Source
                </a>
            </div>
            ` : ''}
        `;
        
        // Show the modal
        recipeModal.show();
        
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        alert('Error loading recipe details. Please try again.');
    }
}

// Event listeners for category buttons
american.addEventListener("click", () => {
    fetchData('american');
});

canadian.addEventListener("click", () => {
    fetchData('canadian');
});

thai.addEventListener("click", () => {
    fetchData('thai');
});

british.addEventListener("click", () => {
    fetchData('british');
});

russian.addEventListener("click", () => {
    fetchData('russian');
});

indian.addEventListener("click", () => {
    fetchData('indian');
});