// Game state variables
let questionDeck = [];
let actionDeck = [];
let gameStarted = false;

// Function to create cards from game data
function createCards(filter = 'all', forPrinting = false) {
    const cardContainer = document.getElementById('card-container');
    
    // Clear existing cards if any
    cardContainer.innerHTML = '';
    
    // When printing, organize cards in pages of exactly 16 cards each (4x4 grid)
    if (forPrinting) {
        const filteredCards = gameData.cards.filter(card => {
            return filter === 'all' || card.type === filter;
        });
        
        // Group cards into sets of exactly 16 for printing (4×4 grid)
        for (let i = 0; i < filteredCards.length; i += 16) {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'card-display print-page';
            
            // Add up to 16 cards per page
            const pageEnd = Math.min(i + 16, filteredCards.length);
            for (let j = i; j < pageEnd; j++) {
                const cardElement = createCardElement(filteredCards[j]);
                pageDiv.appendChild(cardElement);
            }
            
            // If we have fewer than 16 cards on the last page, add empty placeholder cards
            // to maintain the grid structure
            if (pageEnd - i < 16) {
                for (let k = 0; k < 16 - (pageEnd - i); k++) {
                    const placeholderCard = document.createElement('div');
                    placeholderCard.className = 'card placeholder';
                    placeholderCard.style.visibility = 'hidden';
                    pageDiv.appendChild(placeholderCard);
                }
            }
            
            cardContainer.appendChild(pageDiv);
        }
    } else {
        // Regular display (not printing)
        const displayDiv = document.createElement('div');
        displayDiv.className = 'card-display';
        
        // Create cards from data
        gameData.cards.forEach(card => {
            // Skip cards that don't match the filter
            if (filter !== 'all' && card.type !== filter) {
                return;
            }
            
            const cardElement = createCardElement(card);
            displayDiv.appendChild(cardElement);
        });
        
        cardContainer.appendChild(displayDiv);
    }
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to start the game
function startGame() {
    // Hide card browser and show game board
    document.getElementById('card-container').innerHTML = '';
    document.getElementById('game-board').style.display = 'block';
    document.body.classList.add('in-game');
    
    // Get all question and action cards
    const questionCards = gameData.cards.filter(card => card.type === 'question');
    const actionCards = gameData.cards.filter(card => card.type === 'action');
    
    // Shuffle both decks
    questionDeck = shuffleArray([...questionCards]);
    actionDeck = shuffleArray([...actionCards]);
    
    // Clear drawn cards areas
    document.getElementById('question-drawn').innerHTML = '';
    document.getElementById('action-drawn').innerHTML = '';
    
    // Initialize decks
    setupDeckListeners();
    
    // Update start button to restart
    const startBtn = document.getElementById('start-btn');
    startBtn.textContent = 'Restart';
    
    gameStarted = true;
}

// Function to set up deck click listeners
function setupDeckListeners() {
    const questionDeckElem = document.getElementById('question-deck');
    const actionDeckElem = document.getElementById('action-deck');
    
    questionDeckElem.onclick = () => {
        if (questionDeck.length > 0) {
            drawCard('question');
        }
    };
    
    actionDeckElem.onclick = () => {
        if (actionDeck.length > 0) {
            drawCard('action');
        }
    };
    
    // Update deck status visual cues
    updateDeckStatus();
}

// Function to draw a card from a deck
function drawCard(deckType) {
    let card;
    let drawnCardsElem;
    
    if (deckType === 'question') {
        if (questionDeck.length === 0) return;
        card = questionDeck.pop();
        drawnCardsElem = document.getElementById('question-drawn');
    } else {
        if (actionDeck.length === 0) return;
        card = actionDeck.pop();
        drawnCardsElem = document.getElementById('action-drawn');
    }
    
    // Create a new card element
    const cardElement = createCardElement(card);
    cardElement.classList.add('card-in-drawn');
    
    // Add to drawn cards area
    drawnCardsElem.prepend(cardElement); // Add to beginning so newest is on top
    
    // Update deck status
    updateDeckStatus();
}

// Function to update the visual status of decks
function updateDeckStatus() {
    const questionDeckElem = document.getElementById('question-deck');
    const actionDeckElem = document.getElementById('action-deck');
    
    // Update question deck
    if (questionDeck.length === 0) {
        questionDeckElem.classList.add('empty');
    } else {
        questionDeckElem.classList.remove('empty');
    }
    
    // Update action deck
    if (actionDeck.length === 0) {
        actionDeckElem.classList.add('empty');
    } else {
        actionDeckElem.classList.remove('empty');
    }
}

// Function to create a single card element
function createCardElement(card) {
    // Create the card element
    const cardElement = document.createElement('div');
    cardElement.className = `card ${card.type}-card`;
    cardElement.setAttribute('data-id', card.id);
    
    // Create the card header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    
    // Add the icon to the header
    const iconData = gameData.iconTypes[card.iconType] || gameData.iconTypes['bible']; // Default to bible icon
    const headerIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    headerIcon.setAttribute("class", "card-icon");
    headerIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    headerIcon.setAttribute("viewBox", iconData.viewBox);
    
    const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    iconPath.setAttribute("d", iconData.path);
    headerIcon.appendChild(iconPath);
    
    // Create the header title
    const headerTitle = document.createElement('h2');
    headerTitle.textContent = card.type.charAt(0).toUpperCase() + card.type.slice(1);
    
    // Assemble the header
    cardHeader.appendChild(headerIcon);
    cardHeader.appendChild(headerTitle);
    
    // Create the card content
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    
    // Create the content paragraph with truncated text if needed
    const contentText = document.createElement('p');
    contentText.textContent = truncateText(card.content, 150); // Limit content length
    if (card.type === 'question') {
        contentText.className = 'question-text';
    }
    
    // Add options if they exist (with truncation)
    if (card.options && card.options.length > 0) {
        const optionsList = document.createElement('ul');
        optionsList.className = 'options-list';
        
        card.options.forEach(option => {
            const optionItem = document.createElement('li');
            optionItem.textContent = truncateText(option, 70); // Limit option length
            optionsList.appendChild(optionItem);
        });
        
        cardContent.appendChild(contentText);
        cardContent.appendChild(optionsList);
    } else {
        cardContent.appendChild(contentText);
    }
    
    // Add content icon
    const contentIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    contentIcon.setAttribute("class", "content-icon");
    contentIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    contentIcon.setAttribute("viewBox", iconData.viewBox);
    
    const contentIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    contentIconPath.setAttribute("d", iconData.path);
    contentIcon.appendChild(contentIconPath);
    
    cardContent.appendChild(contentIcon);
    
    // Create the answer section for question cards (with truncation)
    if (card.type === 'question' && card.answer) {
        const answerSection = document.createElement('div');
        answerSection.className = 'card-answer';
        
        const answerText = document.createElement('p');
        answerText.textContent = `Answer: ${truncateText(card.answer, 120)}`; // Limit answer length
        
        answerSection.appendChild(answerText);
        cardElement.appendChild(cardHeader);
        cardElement.appendChild(cardContent);
        cardElement.appendChild(answerSection);
    } else {
        cardElement.appendChild(cardHeader);
        cardElement.appendChild(cardContent);
    }
    
    return cardElement;
}

// Function to truncate text to fit within cards
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

// Initialize the filter buttons
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Exit game mode if we're in it
            if (gameStarted) {
                resetGameView();
            }
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Save the current filter
            currentFilter = button.dataset.filter;
            // Apply the filter
            createCards(currentFilter);
        });
    });
    
    // Initialize print button
    document.getElementById('print-btn').addEventListener('click', () => {
        // Generate PDF with 4×3 grid layout instead of using browser print
        generateCardsPDF();
    });
    
    // Initialize start/restart button
    document.getElementById('start-btn').addEventListener('click', () => {
        if (gameStarted) {
            // If the game is already started, restart it
            startGame();
        } else {
            // Start the game
            startGame();
        }
    });
}

// Function to reset game view and go back to browsing mode
function resetGameView() {
    document.getElementById('game-board').style.display = 'none';
    document.body.classList.remove('in-game');
    createCards('all');
    
    // Reset start button text
    const startBtn = document.getElementById('start-btn');
    startBtn.textContent = 'Start';
    
    gameStarted = false;
}

// Function to create decks for printing in a 4×2 grid layout (8 cards per page)
function createDecksToPrint() {
    // Create a container for the printable cards (hidden for now)
    const printContainer = document.createElement('div');
    printContainer.id = 'print-deck-container';
    printContainer.style.display = 'none'; // Hide until print time
    document.querySelector('.container').appendChild(printContainer);
    
    // Add all cards for printing
    const allCardsDiv = document.createElement('div');
    allCardsDiv.className = 'print-all-cards';
    
    // Create cards from data for printing (all cards)
    const filteredCards = gameData.cards;
    
    // Group cards into sets of 8 for printing (4×2 grid)
    for (let i = 0; i < filteredCards.length; i += 8) {
        const cardPageDiv = document.createElement('div');
        cardPageDiv.className = 'card-print-page';
        
        // Add up to 8 cards per page (4×2 grid)
        const pageEnd = Math.min(i + 8, filteredCards.length);
        for (let j = i; j < pageEnd; j++) {
            const card = filteredCards[j];
            
            // Create a print card that exactly matches the normal card structure
            const printCard = document.createElement('div');
            printCard.className = `print-card ${card.type}-card`;
            printCard.setAttribute('data-id', card.id);
            
            // Create the card header
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';
            
            // Add the icon to the header with the same structure as normal cards
            const iconData = gameData.iconTypes[card.iconType] || gameData.iconTypes['bible'];
            const headerIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            headerIcon.setAttribute("class", "card-icon");
            headerIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            headerIcon.setAttribute("viewBox", iconData.viewBox);
            
            const iconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            iconPath.setAttribute("d", iconData.path);
            headerIcon.appendChild(iconPath);
            
            // Create the header title
            const headerTitle = document.createElement('h2');
            headerTitle.textContent = card.type.charAt(0).toUpperCase() + card.type.slice(1);
            
            // Assemble the header
            cardHeader.appendChild(headerIcon);
            cardHeader.appendChild(headerTitle);
            
            // Create the card content
            const cardContent = document.createElement('div');
            cardContent.className = 'card-content';
            
            // Create the content paragraph (no truncation for print)
            const contentText = document.createElement('p');
            contentText.textContent = card.content;
            if (card.type === 'question') {
                contentText.className = 'question-text';
            }
            
            // Add options if they exist (no truncation for print)
            if (card.options && card.options.length > 0) {
                const optionsList = document.createElement('ul');
                optionsList.className = 'options-list';
                
                card.options.forEach(option => {
                    const optionItem = document.createElement('li');
                    optionItem.textContent = option;
                    optionsList.appendChild(optionItem);
                });
                
                cardContent.appendChild(contentText);
                cardContent.appendChild(optionsList);
            } else {
                cardContent.appendChild(contentText);
            }
            
            // Add content icon
            const contentIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            contentIcon.setAttribute("class", "content-icon");
            contentIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            contentIcon.setAttribute("viewBox", iconData.viewBox);
            
            const contentIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            contentIconPath.setAttribute("d", iconData.path);
            contentIcon.appendChild(contentIconPath);
            
            cardContent.appendChild(contentIcon);
            
            // Create the answer section for question cards (no truncation for print)
            if (card.type === 'question' && card.answer) {
                const answerSection = document.createElement('div');
                answerSection.className = 'card-answer';
                
                const answerText = document.createElement('p');
                answerText.textContent = `Answer: ${card.answer}`;
                
                answerSection.appendChild(answerText);
                printCard.appendChild(cardHeader);
                printCard.appendChild(cardContent);
                printCard.appendChild(answerSection);
            } else {
                printCard.appendChild(cardHeader);
                printCard.appendChild(cardContent);
            }
            
            cardPageDiv.appendChild(printCard);
        }
        
        // If we have fewer than 8 cards on the last page, add empty placeholder cards
        if (pageEnd - i < 8) {
            for (let k = 0; k < 8 - (pageEnd - i); k++) {
                const placeholderCard = document.createElement('div');
                placeholderCard.className = 'print-card placeholder';
                placeholderCard.style.visibility = 'hidden';
                cardPageDiv.appendChild(placeholderCard);
            }
        }
        
        allCardsDiv.appendChild(cardPageDiv);
    }
    
    printContainer.appendChild(allCardsDiv);
}

// Function to create a PDF with cards in a 4×3 grid layout
function generateCardsPDF() {
    // Get filtered cards
    const filteredCards = gameData.cards;
    const { jsPDF } = window.jspdf;
    
    // Create a new PDF document (landscape for better fit of 4×3 grid)
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'letter'
    });

    // PDF dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Margins
    const margin = 10;
    
    // Define card dimensions (4 columns, 3 rows)
    const cardWidth = (pageWidth - (margin * 2) - (15 * 3)) / 4;  // 3 gaps between cards
    const cardHeight = (pageHeight - (margin * 2) - (15 * 2)) / 3; // 2 gaps between cards
    
    // Color constants from your CSS variables
    const colors = {
        questionCardColor: '#4CAF50',
        actionCardColor: '#FFD700',
        questionCardDark: '#2E7D32',
        actionCardDark: '#DAA520',
        cardText: '#333',
        cardAnswer: '#666',
        cardBg: '#fff',
        headerTextLight: '#fff',
        headerTextDark: '#333',
        borderLight: '#ccc'
    };
    
    // Create cards for PDF
    let cardIndex = 0;
    let currentPage = 1;
    
    // Process all cards
    while (cardIndex < filteredCards.length) {
        // Process 12 cards per page (4×3)
        for (let row = 0; row < 3 && cardIndex < filteredCards.length; row++) {
            for (let col = 0; col < 4 && cardIndex < filteredCards.length; col++) {
                const card = filteredCards[cardIndex];
                const x = margin + (col * (cardWidth + 5));
                const y = margin + (row * (cardHeight + 5));
                
                // Get card type specific colors
                const isQuestionCard = card.type === 'question';
                const cardColor = isQuestionCard ? colors.questionCardColor : colors.actionCardColor;
                const cardDarkColor = isQuestionCard ? colors.questionCardDark : colors.actionCardDark;
                const headerTextColor = isQuestionCard ? colors.headerTextLight : colors.headerTextDark;
                
                // Draw card background (removed gray shadow/border)
                doc.setFillColor(255, 255, 255);
                doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
                
                // Add the decorative background pattern (similar to the ::before pseudo-element)
                // We'll simulate the pattern with a very light gray rectangle
                doc.setFillColor(252, 252, 252); // Even lighter than before
                doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
                
                // Draw card border (3px in your CSS)
                if (isQuestionCard) {
                    doc.setDrawColor(parseInt(colors.questionCardColor.substr(1, 2), 16), 
                                    parseInt(colors.questionCardColor.substr(3, 2), 16), 
                                    parseInt(colors.questionCardColor.substr(5, 2), 16));
                } else {
                    doc.setDrawColor(parseInt(colors.actionCardColor.substr(1, 2), 16),
                                    parseInt(colors.actionCardColor.substr(3, 2), 16),
                                    parseInt(colors.actionCardColor.substr(5, 2), 16));
                }
                doc.setLineWidth(1.5); // Thicker border to match the 3px in CSS (scaled down for PDF)
                doc.setLineDashPattern([0], 0);
                doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'S');
                
                // Draw header with rounded top corners
                const headerHeight = cardHeight * 0.12; // Approximating the header height ratio
                doc.setFillColor(parseInt(cardColor.substr(1, 2), 16),
                                parseInt(cardColor.substr(3, 2), 16),
                                parseInt(cardColor.substr(5, 2), 16));
                
                // Draw header background with rounded top corners
                doc.roundedRect(x, y, cardWidth, headerHeight, 3, 3, 'F');
                // Then cover the bottom rounded corners with a rectangle
                doc.rect(x, y + headerHeight - 3, cardWidth, 3, 'F');
                
                // Add header text with proper styling
                if (isQuestionCard) {
                    doc.setTextColor(255, 255, 255); // White text for question cards
                } else {
                    doc.setTextColor(51, 51, 51); // Darker text for action cards
                }
                // FURTHER REDUCED: Header text size from 11 to 10
                doc.setFontSize(10); 
                
                // Add header text with icon positioning
                const headerText = card.type.charAt(0).toUpperCase() + card.type.slice(1);
                doc.text(headerText, x + cardWidth/2, y + headerHeight/2 + 1, { align: 'center' });
                
                // Add card content with proper styling
                doc.setTextColor(51, 51, 51); // Match your card-text color
                // FURTHER REDUCED: Content text size from 8 to 7
                doc.setFontSize(7);
                
                const contentStartY = y + headerHeight + 4;
                // Word wrap the content - Added even more padding
                const contentLines = doc.splitTextToSize(card.content, cardWidth - 14);
                doc.text(contentLines, x + 6, contentStartY);
                
                // Further adjusted line height multiplier
                let currentY = contentStartY + (contentLines.length * 3.5);
                
                // Add options if they exist (with proper styling)
                if (card.options && card.options.length > 0) {
                    currentY += 3; // Reduced space before options from 4 to 3
                    
                    // Options list styling
                    const optionsColor = isQuestionCard ? colors.questionCardDark : colors.actionCardDark;
                    doc.setTextColor(parseInt(optionsColor.substr(1, 2), 16),
                                    parseInt(optionsColor.substr(3, 2), 16),
                                    parseInt(optionsColor.substr(5, 2), 16));
                    // FURTHER REDUCED: Option text size from 7 to 6
                    doc.setFontSize(6);
                    
                    // Add each option with proper formatting
                    card.options.forEach((option, index) => {
                        // Added even more padding for option text
                        const optionLines = doc.splitTextToSize(option, cardWidth - 16);
                        doc.text(optionLines, x + 6, currentY);
                        // Further adjusted line height multiplier
                        currentY += optionLines.length * 3 + 1.5;
                    });
                }
                
                // Add decorative content icon (similar to your SVG icons)
                // FURTHER REDUCED: Icon size from 8 to 6
                const iconSize = 6;
                const iconX = x + cardWidth/2 - iconSize/2;
                const iconY = currentY + 3; // Reduced space above icon from 4 to 3
                
                // Simple circular icon as placeholder (similar to content-icon)
                if (isQuestionCard) {
                    doc.setDrawColor(parseInt(colors.questionCardColor.substr(1, 2), 16),
                                    parseInt(colors.questionCardColor.substr(3, 2), 16),
                                    parseInt(colors.questionCardColor.substr(5, 2), 16));
                    doc.setFillColor(parseInt(colors.questionCardColor.substr(1, 2), 16),
                                    parseInt(colors.questionCardColor.substr(3, 2), 16),
                                    parseInt(colors.questionCardColor.substr(5, 2), 16));
                } else {
                    doc.setDrawColor(parseInt(colors.actionCardDark.substr(1, 2), 16),
                                    parseInt(colors.actionCardDark.substr(3, 2), 16),
                                    parseInt(colors.actionCardDark.substr(5, 2), 16));
                    doc.setFillColor(parseInt(colors.actionCardDark.substr(1, 2), 16),
                                    parseInt(colors.actionCardDark.substr(3, 2), 16),
                                    parseInt(colors.actionCardDark.substr(5, 2), 16));
                }
                
                // Draw a simple icon (circle with cross)
                doc.circle(iconX + iconSize/2, iconY + iconSize/2, iconSize/2, 'S');
                doc.line(iconX + iconSize/2, iconY, iconX + iconSize/2, iconY + iconSize);
                doc.line(iconX, iconY + iconSize/2, iconX + iconSize, iconY + iconSize/2);
                
                // Further reduced space after icon (from 6 to 5)
                currentY += iconSize + 5;
                
                // Add answer section for question cards with proper styling
                if (isQuestionCard && card.answer) {
                    // Make sure we don't overflow the card
                    if (currentY < y + cardHeight - 10) { // Reduced buffer from 12 to 10                       
                        currentY += 3.5; // Reduced space after separator from 4 to 3.5
                        
                        // FURTHER REDUCED: Answer text size from 6 to 5.5
                        doc.setFontSize(5.5);
                        doc.setTextColor(102, 102, 102); // Match your var(--card-answer)
                        // Added extra padding for answer text
                        const answerLines = doc.splitTextToSize(`Answer: ${card.answer}`, cardWidth - 16);
                        doc.text(answerLines, x + 7, currentY);
                    }
                }
                
                cardIndex++;
            }
        }
        
        // Add a new page if there are more cards to process
        if (cardIndex < filteredCards.length) {
            doc.addPage();
            currentPage++;
        }
    }
    
    // Save PDF with a descriptive name
    doc.save('bible-game-cards.pdf');
}

// When the page loads, create the cards and initialize filters
window.addEventListener('DOMContentLoaded', () => {
    createCards();
    initFilters();
});