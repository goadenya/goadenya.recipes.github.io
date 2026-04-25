<script>
  import { onMount } from 'svelte';
  import { recipes } from './recipes.js';

  const COOKIE_NAME = 'auth';
  const PASSWORD = 'securepassword123';

  let password = '';
  let authenticated = false;
  let error = '';
  let selectedRecipe = null;
  let selectedCategory = null;
  let modalOpen = false;
  let modalSrc = '';
  let modalCaption = '';

  const categories = ['Förrätt', 'Varmrätt', 'Dessert'];

  function getCookie(name) {
    return document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1] || '';
  }

  function setCookie(name, value, maxAgeSeconds) {
    document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}`;
  }

  function clearCookie(name) {
    document.cookie = `${name}=; path=/; max-age=0`;
  }

  function login() {
    if (password === PASSWORD) {
      setCookie(COOKIE_NAME, 'authenticated', 24 * 60 * 60);
      authenticated = true;
      error = '';
      selectedRecipe = null;
    } else {
      error = 'Fel lösenord. Försök igen.';
    }
  }

  function logout() {
    clearCookie(COOKIE_NAME);
    authenticated = false;
    password = '';
    selectedRecipe = null;
    selectedCategory = null;
  }

  function selectCategory(category) {
    selectedCategory = category;
    selectedRecipe = null;
  }

  function showAll() {
    selectedCategory = null;
    selectedRecipe = null;
  }

  function openRecipe(recipe) {
    selectedRecipe = recipe;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openImageModal(src, caption) {
    modalSrc = src;
    modalCaption = caption;
    modalOpen = true;
  }

  function closeImageModal(event) {
    if (event.target.classList.contains('image-modal') || event.target.classList.contains('image-modal-close')) {
      modalOpen = false;
    }
  }

  function getImageAltText(path, fallback) {
    if (!path) return fallback;
    const filename = path.split('/').pop().split('.')[0].toLowerCase();
    const map = {
      ingredients: 'Ingredienser för carnitas - kryddor, kött och grönsaker',
      fried_bacon: 'Stekt bacon som renderar fett för stekning av kött',
      carnitas_cooking_on_stove: 'Carnitas som bryns och kokar i kastrull på spisen',
      liquid_smoke_bottle: 'Flaska med liquid smoke krydda för extra rökig smak',
      finished_carnitas: 'Färdiga carnitas med krispiga kanter, redo att serveras',
    };
    return map[filename] || fallback;
  }

  $: filteredRecipes = selectedCategory ? recipes.filter((r) => r.category === selectedCategory) : recipes;

  onMount(() => {
    authenticated = getCookie(COOKIE_NAME) === 'authenticated';
  });
</script>

{#if !authenticated}
  <div class="login-wrapper">
    <div class="login-card">
      <h2>Logga in</h2>
      <form on:submit|preventDefault={login}>
        <input type="password" bind:value={password} placeholder="Lösenord" required />
        {#if error}
          <p class="error">{error}</p>
        {/if}
        <button type="submit">Logga in</button>
      </form>
    </div>
  </div>
{:else}
  <div class="blog-header">
    <h1>Smakfullt</h1>
    <p>Recept med kärlek &amp; hantverk</p>
  </div>

  <nav class="nav">
    <button class:selected={selectedCategory === null} type="button" on:click={showAll}>Hem</button>
    {#each categories as category}
      <button class:selected={selectedCategory === category} type="button" on:click={() => selectCategory(category)}>{category}</button>
    {/each}
    <button type="button" on:click={logout}>Logga ut</button>
  </nav>

  <main class="main">
    {#if selectedRecipe}
      <button class="back-btn" on:click={showAll}>← Tillbaka till alla recept</button>
      <button class="hero-button" type="button" on:click={() => openImageModal(selectedRecipe.heroImage, selectedRecipe.title)}>
        <img src={selectedRecipe.heroImage} alt={getImageAltText(selectedRecipe.heroImage, selectedRecipe.title)} />
      </button>
      <div class="recipe-header">
        <div class="recipe-category">{selectedRecipe.category}</div>
        <h1 class="recipe-title">{selectedRecipe.title}</h1>
        <p class="recipe-desc">{selectedRecipe.desc}</p>
        <div class="recipe-meta-bar">
          <div class="meta-item"><span class="meta-label">Tid</span><span class="meta-value">{selectedRecipe.time}</span></div>
          <div class="meta-item"><span class="meta-label">Portioner</span><span class="meta-value">{selectedRecipe.servings}</span></div>
          <div class="meta-item"><span class="meta-label">Svårighetsgrad</span><span class="meta-value">{selectedRecipe.difficulty}</span></div>
        </div>
      </div>
      <div class="two-col">
        <div>
          <div class="section-title">Ingredienser</div>
          <ul class="ingredients-list">
            {#each selectedRecipe.ingredients as ingredient}
              <li><span class="ing-name">{ingredient.name}</span><span class="ing-amount">{ingredient.amount}</span></li>
            {/each}
          </ul>
        </div>
        <div>
          <div class="section-title">Gör så här</div>
          <ol class="steps-list">
            {#each selectedRecipe.steps as step, index}
              <li class="step-item">
                <div class="step-num">0{index + 1}</div>
                <p class="step-text">{step.text}</p>
                {#if step.image}
                  <button class="step-img" type="button" on:click={() => openImageModal(step.image, `Steg ${index + 1}`)}>
                    <img src={step.image} alt={getImageAltText(step.image, `Steg ${index + 1}`)} />
                    <div class="step-img-caption">Steg {index + 1}</div>
                  </button>
                {/if}
              </li>
            {/each}
          </ol>
        </div>
      </div>
    {:else}
      <div class="recipe-grid">
        {#each filteredRecipes as recipe}
          <button class="recipe-card" type="button" on:click={() => openRecipe(recipe)}>
            <div class="card-img-wrapper">
              <img src={recipe.heroImage} alt={getImageAltText(recipe.heroImage, recipe.title)} />
            </div>
            <div class="card-body">
              <div class="card-tag">{recipe.category}</div>
              <h3 class="card-title">{recipe.title}</h3>
              <div class="card-meta">
                <span>⏱ {recipe.time}</span>
                <span>👤 {recipe.servings} pers</span>
                <span>{recipe.difficulty}</span>
              </div>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </main>

  {#if modalOpen}
    <div class="image-modal" role="dialog" aria-modal="true">
      <div class="image-modal-content">
        <button class="image-modal-close" aria-label="Stäng bild" type="button" on:click={() => (modalOpen = false)}>×</button>
        <img src={modalSrc} alt={modalCaption} />
        <div class="image-modal-caption">{modalCaption}</div>
      </div>
    </div>
  {/if}
{/if}

<style>
  :global(body) {
    margin: 0;
    font-family: 'Lato', sans-serif;
    background: #faf7f2;
    color: #1a1510;
    min-height: 100vh;
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  .login-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .login-card {
    width: min(400px, 100%);
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  }

  .login-card h2 {
    margin-bottom: 1rem;
    font-family: 'Playfair Display', serif;
    text-align: center;
  }

  .login-card input {
    width: 100%;
    padding: 0.85rem 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    border: 1px solid #d4c4b0;
    font-size: 1rem;
  }

  .login-card button {
    width: 100%;
    padding: 0.85rem 1rem;
    background: #c8783a;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 700;
  }

  .error {
    color: #b22222;
    margin-bottom: 1rem;
  }

  .blog-header {
    background: #1a1510;
    color: #faf7f2;
    padding: 2.5rem 2rem 2rem;
    text-align: center;
    border-bottom: 3px solid #c8783a;
  }

  .blog-header h1,
  .blog-header p {
    margin: 0;
  }

  .blog-header h1 {
    font-size: clamp(2rem, 4vw, 2.4rem);
    font-family: 'Playfair Display', serif;
  }

  .blog-header p {
    margin-top: 0.5rem;
    font-size: 0.95rem;
    color: #b8a898;
    font-weight: 300;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    padding: 1rem 2rem;
    background: #1a1510;
    border-bottom: 1px solid #333;
  }

  .nav button {
    background: none;
    border: none;
    color: #b8a898;
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.2s;
    padding: 0;
    font-family: inherit;
  }

  .nav button.selected {
    color: #c8783a;
  }

  .hero-button {
    display: block;
    width: 100%;
    border: none;
    padding: 0;
    background: transparent;
    cursor: pointer;
    text-align: left;
  }

  .hero-button img {
    width: 100%;
    height: 360px;
    object-fit: cover;
    border-radius: 16px;
    margin-bottom: 2rem;
  }

  .main {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
  }

  .recipe-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #e8ddd0;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .recipe-card:hover,
  .recipe-card:focus-visible {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    outline: none;
  }

  .recipe-card[type='button'] {
    border: none;
    background: transparent;
    padding: 0;
  }

  .recipe-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .card-img-wrapper {
    width: 100%;
    min-height: 200px;
    overflow: hidden;
    background: linear-gradient(135deg, #e8ddd0, #d4c4b0);
  }

  .card-img-wrapper img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }

  .card-body {
    padding: 1.2rem;
  }

  .card-tag {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #c8783a;
    font-weight: 700;
    margin-bottom: 0.4rem;
  }

  .card-title {
    font-size: 1.2rem;
    color: #1a1510;
    margin-bottom: 0.6rem;
    line-height: 1.3;
  }

  .card-meta {
    font-size: 0.85rem;
    color: #8a7a6a;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: #5c4a32;
    font-size: 0.95rem;
    cursor: pointer;
    margin-bottom: 1.5rem;
    background: none;
    border: none;
    font-family: 'Lato', sans-serif;
    padding: 0;
  }

  .recipe-header {
    margin-bottom: 2rem;
  }

  .recipe-category {
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #c8783a;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .recipe-title {
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    margin-bottom: 0.8rem;
    line-height: 1.2;
  }

  .recipe-desc {
    color: #6a5a4a;
    font-size: 1rem;
    line-height: 1.75;
    font-weight: 300;
    margin-bottom: 1.2rem;
  }

  .recipe-meta-bar {
    display: flex;
    gap: 1.5rem;
    padding: 1rem 0;
    border-top: 1px solid #e8ddd0;
    border-bottom: 1px solid #e8ddd0;
  }

  .meta-item {
    text-align: center;
  }

  .meta-label {
    display: block;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #8a7a6a;
    margin-bottom: 0.2rem;
  }

  .meta-value {
    font-size: 1rem;
    font-weight: 700;
    color: #1a1510;
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1.6fr;
    gap: 2.5rem;
    margin-top: 2rem;
  }

  .section-title {
    font-size: 0.95rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #c8783a;
    margin-bottom: 1.2rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #c8783a;
  }

  .ingredients-list,
  .steps-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ingredients-list li {
    display: flex;
    justify-content: space-between;
    padding: 0.55rem 0;
    border-bottom: 1px solid #e8ddd0;
    font-size: 0.95rem;
    color: #1a1510;
  }

  .ing-name {
    color: #5c4a32;
  }

  .ing-amount {
    font-weight: 700;
  }

  .step-item {
    margin-bottom: 2rem;
  }

  .step-num {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: #e8ddd0;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.3rem;
  }

  .step-text {
    font-size: 0.95rem;
    color: #4a3a2a;
    line-height: 1.75;
    font-weight: 300;
    margin-bottom: 0.8rem;
  }

  .step-img {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: #e8ddd0;
    cursor: pointer;
    border: none;
    display: block;
    padding: 0;
    text-align: left;
  }

  .step-img img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    display: block;
  }

  .step-img-caption {
    padding: 0.65rem 0.8rem;
    font-size: 0.75rem;
    color: #8a7a6a;
    font-style: italic;
    background: #f6f1ec;
  }

  .image-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1.5rem;
  }

  .image-modal-content {
    max-width: 95%;
    max-height: 95%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .image-modal-content img {
    max-width: 90vw;
    max-height: 75vh;
    width: auto;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  }

  .image-modal-close {
    position: absolute;
    top: -0.75rem;
    right: -0.75rem;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.95);
    color: #1a1510;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .image-modal-caption {
    margin-top: 0.8rem;
    color: #fff;
    font-size: 0.95rem;
    text-align: center;
    max-width: 95%;
  }

  @media (max-width: 600px) {
    .nav {
      padding: 1rem;
    }

    .recipe-meta-bar {
      flex-direction: column;
      gap: 0.75rem;
    }

    .two-col {
      grid-template-columns: 1fr;
    }
  }
</style>
