// Global variables
let casesData = [];
let currentBattle = null;

// Game modes and player configurations
const gameModes = ['NORMAL', 'CRAZY', 'NORMAL JP', 'CRAZY JP'];
const playerConfigs = ['1V1', '1V1V1', '1V1V1V1V1V1', '2V2', '2V2V2', '3V3'];

// Load cases data on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadCasesData();
    setupEventListeners();
});

// Load cases from JSON file
async function loadCasesData() {
    try {
        const response = await fetch('cases.json');
        const rawCases = await response.json();
        
        // Convert price strings to numbers
        casesData = rawCases.map(caseItem => ({
            ...caseItem,
            price: parseFloat(caseItem.price.replace(/,/g, ''))
        }));
        
        console.log(`Loaded ${casesData.length} cases`);
    } catch (error) {
        console.error('Error loading cases data:', error);
        casesData = [];
    }
}

// Setup event listeners
function setupEventListeners() {
    const spinBtn = document.getElementById('spinBtn');
    const maxBtn = document.querySelector('.max-btn');
    const totalBoxesInput = document.getElementById('totalBoxes');
    const sameBoxesSlider = document.getElementById('sameBoxesSlider');
    const sliderValue = document.querySelector('.slider-value');
    const battleModeDropdown = document.getElementById('battleModeDropdown');
    const battleModeMenu = document.getElementById('battleModeMenu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const randomizeGamemodeCheckbox = document.getElementById('randomizeGamemode');

    spinBtn.addEventListener('click', generateBattle);
    maxBtn.addEventListener('click', () => {
        totalBoxesInput.value = 20;
    });

    // Battle mode dropdown functionality
    battleModeDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        // Don't allow manual selection if randomize is enabled
        if (randomizeGamemodeCheckbox.checked) return;
        
        const isActive = battleModeMenu.classList.contains('active');
        battleModeDropdown.classList.toggle('active', !isActive);
        battleModeMenu.classList.toggle('active', !isActive);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        battleModeDropdown.classList.remove('active');
        battleModeMenu.classList.remove('active');
    });

    // Handle dropdown item selection
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            // Don't allow manual selection if randomize is enabled
            if (randomizeGamemodeCheckbox.checked) return;
            
            // Remove selected class from all items
            dropdownItems.forEach(i => i.classList.remove('selected'));
            // Add selected class to clicked item
            item.classList.add('selected');
            
            // Update the trigger display
            updateDropdownDisplay(item.dataset.mode);
            
            // Close dropdown
            battleModeDropdown.classList.remove('active');
            battleModeMenu.classList.remove('active');
        });
    });

    // Randomize game mode toggle
    randomizeGamemodeCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            // Disable manual selection and add visual indicator
            battleModeDropdown.style.opacity = '0.6';
            battleModeDropdown.style.pointerEvents = 'none';
            // Clear current selection
            dropdownItems.forEach(item => item.classList.remove('selected'));
        } else {
            // Enable manual selection
            battleModeDropdown.style.opacity = '1';
            battleModeDropdown.style.pointerEvents = 'auto';
            // Set default selection
            const defaultItem = document.querySelector('[data-mode="1v1v1"]');
            defaultItem.classList.add('selected');
            updateDropdownDisplay('1v1v1');
        }
    });

    // Update slider value display
    sameBoxesSlider.addEventListener('input', (e) => {
        sliderValue.textContent = `${e.target.value}x`;
    });

    // Add click listeners to checkboxes for better interaction
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.id === 'sameBoxesMultipleTimes') {
                const sliderContainer = document.querySelector('.slider-container');
                sliderContainer.style.opacity = e.target.checked ? '1' : '0.5';
            }
        });
    });
}

// Update dropdown display based on selected mode
function updateDropdownDisplay(mode) {
    const modeText = document.querySelector('.mode-text');
    const modeVisual = document.querySelector('.mode-visual-small');
    
    // Update text
    modeText.textContent = mode;
    
    // Update visual representation
    const visualConfigs = {
        '1v1': `<svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span class="vs-small">VS</span><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
        
        '1v1v1': `<svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span class="vs-small">VS</span><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span class="vs-small">VS</span><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span class="vs-small">VS</span><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
        
        '1v1v1v1': `<svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span class="vs-small">VS</span><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span class="vs-small">VS</span><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span class="vs-small">VS</span><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
        
        '1v1v1v1v1v1': `<svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span class="vs-small">VS</span><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span class="vs-small">VS</span><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span class="vs-small">VS</span><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span class="vs-small">VS</span><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><span class="vs-small">VS</span><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
        
        '2v2': `<div style="display:flex;gap:2px;"><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div><span class="vs-small">VS</span><div style="display:flex;gap:2px;"><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>`,
        
        '2v2v2': `<div style="display:flex;gap:2px;"><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div><span class="vs-small">VS</span><div style="display:flex;gap:2px;"><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div><span class="vs-small">VS</span><div style="display:flex;gap:2px;"><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>`,
        
        '3v3': `<div style="display:flex;gap:2px;"><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div><span class="vs-small">VS</span><div style="display:flex;gap:2px;"><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div><span class="vs-small">VS</span><div style="display:flex;gap:2px;"><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg><svg class="person-icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>`
    };
    
    modeVisual.innerHTML = visualConfigs[mode] || visualConfigs['1v1v1'];
}

// Get selected battle mode
function getSelectedBattleMode() {
    const randomizeGamemode = document.getElementById('randomizeGamemode').checked;
    
    if (randomizeGamemode) {
        // Return random battle mode - now includes 1v1v1v1v1v1
        const battleModes = ['1v1', '1v1v1', '1v1v1v1', '1v1v1v1v1v1', '2v2', '2v2v2', '3v3'];
        return battleModes[Math.floor(Math.random() * battleModes.length)];
    } else {
        // Return manually selected battle mode
        const selectedItem = document.querySelector('.dropdown-item.selected');
        return selectedItem ? selectedItem.dataset.mode : '1v1v1';
    }
}

// Generate random battle
function generateBattle() {
    const totalValue = parseFloat(document.getElementById('totalValue').value);
    const totalBoxes = parseInt(document.getElementById('totalBoxes').value);
    const battleMode = getSelectedBattleMode();
    const priceRange = document.getElementById('priceRange').value;
    
    // Validation
    if (!totalValue || totalValue <= 0) {
        alert('Please enter a valid total value');
        return;
    }
    
    if (!totalBoxes || totalBoxes <= 0 || totalBoxes > 20) {
        alert('Please enter a valid number of cases (1-20)');
        return;
    }

    // Get settings
    const randomizeGamemode = document.getElementById('randomizeGamemode').checked;
    const sameBoxesMultipleTimes = document.getElementById('sameBoxesMultipleTimes').checked;
    const sameBoxesCount = parseInt(document.getElementById('sameBoxesSlider').value);

    // Filter cases based on price range
    let filteredCases = filterCasesByPrice(casesData, priceRange);
    
    if (filteredCases.length === 0) {
        alert('No cases found in the selected price range');
        return;
    }

    // Generate battle configuration
    const gameMode = getRandomGameMode(); // Always randomize the JP/Normal/Crazy modes
    const playerConfig = battleMode; // Use selected or random battle mode
    
    // Select cases for the battle
    const selectedCases = selectCasesForBattle(filteredCases, totalBoxes, totalValue, sameBoxesMultipleTimes, sameBoxesCount);
    
    if (selectedCases.length === 0) {
        alert('Could not find suitable cases for the specified value and constraints');
        return;
    }

    // Create battle object
    currentBattle = {
        totalValue: selectedCases.reduce((sum, caseItem) => sum + caseItem.price, 0),
        totalCases: selectedCases.length,
        gameMode: gameMode,
        playerConfig: playerConfig,
        cases: selectedCases
    };

    // Show results
    displayBattleResults(currentBattle);
}

// Filter cases by price range
function filterCasesByPrice(cases, priceRange) {
    const ranges = {
        '$0 - $100,000': [0, 100000],
        '$0 - $1,000': [0, 1000],
        '$1,000 - $5,000': [1000, 5000],
        '$5,000 - $20,000': [5000, 20000]
    };
    
    const [min, max] = ranges[priceRange] || [0, 100000];
    return cases.filter(caseItem => caseItem.price >= min && caseItem.price <= max);
}

// Select cases for battle based on constraints
function selectCasesForBattle(availableCases, targetCount, targetValue, allowDuplicates, duplicateCount) {
    let selectedCases = [];
    
    // Calculate target price per case
    const targetPricePerCase = targetValue / targetCount;
    
    // Sort cases by how close they are to the target price
    const sortedCases = [...availableCases].sort((a, b) => {
        const diffA = Math.abs(a.price - targetPricePerCase);
        const diffB = Math.abs(b.price - targetPricePerCase);
        return diffA - diffB;
    });
    
    // If same boxes multiple times is enabled
    if (allowDuplicates && duplicateCount > 1) {
        // Find cases close to target price per case
        const suitableCases = sortedCases.filter(c => 
            c.price >= targetPricePerCase * 0.7 && 
            c.price <= targetPricePerCase * 1.3
        );
        
        if (suitableCases.length > 0) {
            const randomCase = suitableCases[Math.floor(Math.random() * Math.min(5, suitableCases.length))];
            const useCount = Math.min(duplicateCount, targetCount);
            
            for (let i = 0; i < useCount; i++) {
                selectedCases.push({ ...randomCase });
            }
            
            // Fill remaining slots with varied cases
            const remainingCount = targetCount - useCount;
            const remainingValue = targetValue - (randomCase.price * useCount);
            
            if (remainingCount > 0) {
                const remainingTargetPrice = remainingValue / remainingCount;
                const variedCases = selectVariedCases(sortedCases, remainingCount, remainingTargetPrice);
                selectedCases.push(...variedCases);
            }
        } else {
            // Fallback to normal selection
            selectedCases = selectVariedCases(sortedCases, targetCount, targetPricePerCase);
        }
    } else {
        // Normal selection with better price matching
        selectedCases = selectVariedCases(sortedCases, targetCount, targetPricePerCase);
    }
    
    return selectedCases.slice(0, targetCount);
}

// Helper function to select varied cases close to target price
function selectVariedCases(sortedCases, count, targetPrice) {
    const selected = [];
    const used = new Set();
    
    // Define price tolerance ranges
    const tolerances = [0.1, 0.2, 0.4, 0.6, 0.8, 1.0, 1.5, 2.0];
    
    for (let i = 0; i < count; i++) {
        let found = false;
        
        // Try each tolerance level
        for (const tolerance of tolerances) {
            const minPrice = targetPrice * (1 - tolerance);
            const maxPrice = targetPrice * (1 + tolerance);
            
            const candidates = sortedCases.filter((caseItem, index) => 
                !used.has(index) && 
                caseItem.price >= minPrice && 
                caseItem.price <= maxPrice
            );
            
            if (candidates.length > 0) {
                // Select a random case from candidates
                const randomIndex = Math.floor(Math.random() * Math.min(3, candidates.length));
                const selectedCase = candidates[randomIndex];
                const originalIndex = sortedCases.indexOf(selectedCase);
                
                selected.push({ ...selectedCase });
                used.add(originalIndex);
                found = true;
                break;
            }
        }
        
        // If no case found in any tolerance, pick any unused case
        if (!found && used.size < sortedCases.length) {
            for (let j = 0; j < sortedCases.length; j++) {
                if (!used.has(j)) {
                    selected.push({ ...sortedCases[j] });
                    used.add(j);
                    break;
                }
            }
        }
    }
    
    return selected;
}

// Get random game mode
function getRandomGameMode() {
    return gameModes[Math.floor(Math.random() * gameModes.length)];
}

// Get random player configuration
function getRandomPlayerConfig() {
    return playerConfigs[Math.floor(Math.random() * playerConfigs.length)];
}

// Display battle results
function displayBattleResults(battle) {
    // Hide settings section
    document.querySelector('.settings-panel').style.display = 'none';
    
    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.style.display = 'block';
    resultsSection.classList.add('fade-in');
    
    // Update battle info
    document.getElementById('resultTotalValue').textContent = `$${battle.totalValue.toFixed(2)}`;
    document.getElementById('resultTotalCases').textContent = battle.totalCases;
    document.getElementById('resultGamemode').textContent = battle.gameMode;
    document.getElementById('resultPlayers').textContent = battle.playerConfig;
    
    // Group cases by name and count duplicates
    const groupedCases = groupCasesByName(battle.cases);
    
    // Display cases
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = '';
    
    let caseNumber = 1;
    groupedCases.forEach((group) => {
        const caseElement = createCaseElement(group.case, caseNumber, group.count);
        resultsGrid.appendChild(caseElement);
        caseNumber++;
    });
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Group cases by name and count duplicates
function groupCasesByName(cases) {
    const groups = new Map();
    
    cases.forEach(caseItem => {
        const key = caseItem.name;
        if (groups.has(key)) {
            groups.get(key).count++;
        } else {
            groups.set(key, {
                case: caseItem,
                count: 1
            });
        }
    });
    
    return Array.from(groups.values());
}

// Create case element for display
function createCaseElement(caseItem, number, count = 1) {
    const div = document.createElement('div');
    div.className = 'case-item';
    div.onclick = () => copyToClipboard(caseItem.name);
    
    const multiplierHtml = count > 1 ? `<div class="case-multiplier">${count}x</div>` : '';
    
    div.innerHTML = `
        <div class="case-number">${number}</div>
        ${multiplierHtml}
        <img src="${caseItem.imageUrl}" alt="${caseItem.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmb250LXNpemU9IjE0cHgiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
        <div class="case-name">${caseItem.name}</div>
        <div class="case-price">$${(caseItem.price * count).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    `;
    
    return div;
}

// Copy case name to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        
        // Show feedback
        const feedback = document.createElement('div');
        feedback.textContent = 'Copied!';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff8c00;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 1500);
        
    } catch (err) {
        console.error('Failed to copy text:', err);
        
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

// Close results and return to settings
function closeResults() {
    document.getElementById('resultsSection').style.display = 'none';
    document.querySelector('.settings-panel').style.display = 'block';
    
    // Clear form values
    document.getElementById('totalValue').value = '';
    document.getElementById('totalBoxes').value = '';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}