// Game state variables
let questionDeck = [];
let actionDeck = [];
let gameStarted = false;

// Online Game Variables
let onlineGameStarted = false;
let onlineGameMode = 'normal'; // 'normal' or 'hard'
let onlinePlayers = [];
let currentPlayerIndex = 0;
let boardSize = 50; // Number of squares on the board
let diceRolling = false;
let lastDiceRoll = 0;
let drawnCard = null;
let waitingForAnswer = false;
let boardLayout = [];

// Constants for online game
const PLAYER_COLORS = ['#FF5252', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0']; // Red, Blue, Green, Yellow, Purple
const BOARD_SQUARE_TYPES = {
    NORMAL: 'normal',
    QUESTION: 'question',
    EXCLAMATION: 'exclamation',
    BELL: 'bell',
    WEB: 'web',
    START: 'start',
    FINISH: 'finish'
};

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
function createCardElement(card, hideAnswer = false) {
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
        
        if (hideAnswer) {
            answerSection.classList.add('hidden-answer');
            
            // Add a "Show Answer" button
            const showAnswerBtn = document.createElement('button');
            showAnswerBtn.className = 'show-answer-btn';
            showAnswerBtn.textContent = 'Show Answer';
            showAnswerBtn.onclick = () => {
                // Remove hidden class and show the answer
                answerSection.classList.remove('hidden-answer');
                showAnswerBtn.style.display = 'none'; // Hide button after revealing answer
            };
            answerSection.appendChild(showAnswerBtn);
        }
        
        const answerText = document.createElement('p');
        answerText.textContent = `Answer: ${truncateText(card.answer, 120)}`; // Limit answer length
        answerText.className = 'answer-text'; // Add class to style the answer text
        
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
    
    // Initialize print button with answers
    document.getElementById('print-btn').addEventListener('click', () => {
        // Generate PDF with answers
        generateCardsPDF(true);
    });
    
    // Initialize print button without answers
    document.getElementById('print-no-answers-btn').addEventListener('click', () => {
        // Generate PDF without answers
        generateCardsPDF(false);
    });
    
    // Initialize rules button
    document.getElementById('rules-btn').addEventListener('click', () => {
        // Show rules container
        document.getElementById('rules-container').style.display = 'flex';
    });
    
    // Initialize close rules button
    document.getElementById('close-rules-btn').addEventListener('click', () => {
        // Hide rules container
        document.getElementById('rules-container').style.display = 'none';
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
function generateCardsPDF(showAnswers = true) {
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
                
                // Add answer section for question cards with proper styling (only if showAnswers is true)
                if (showAnswers && isQuestionCard && card.answer) {
                    // Make sure we don't overflow the card
                    if (currentY < y + cardHeight - 10) { // Reduced buffer from 12 to 10                        
                        currentY += 3.5; // Reduced space after separator from 4 to 3.5
                        
                        // Style for the answer text (matching your card-answer)
                        doc.setFillColor(248, 248, 248); // Lighter gray background
                        
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
    const fileName = showAnswers ? 'bible-game-cards.pdf' : 'bible-game-cards-no-answers.pdf';
    doc.save(fileName);
}

// When the page loads, create the cards and initialize filters
window.addEventListener('DOMContentLoaded', () => {
    createCards();
    initFilters();
    initOnlineGame();
});

// Initialize the online game when the button is clicked
function initOnlineGame() {
    document.getElementById('online-game-btn').addEventListener('click', () => {
        // Show the online game container
        document.getElementById('online-game-container').style.display = 'flex';
        
        // Setup player controls
        setupPlayerInputs();
    });
    
    // Setup start online game button
    document.getElementById('start-online-game-btn').addEventListener('click', startOnlineGame);
    
    // Setup the roll dice button
    document.getElementById('roll-dice-btn').addEventListener('click', rollDice);
    
    // Also make the dice itself clickable
    document.getElementById('dice').addEventListener('click', rollDice);
    
    // Setup draw card button
    document.getElementById('draw-card-btn').addEventListener('click', drawOnlineCard);
    
    // Setup answer buttons
    document.getElementById('answer-correct-btn').addEventListener('click', () => handleAnswer(true));
    document.getElementById('answer-wrong-btn').addEventListener('click', () => handleAnswer(false));
    
    // Setup end game button
    document.getElementById('end-game-btn').addEventListener('click', endOnlineGame);
}

// Handle adding and removing players from the setup form
function setupPlayerInputs() {
    const addPlayerBtn = document.getElementById('add-player-btn');
    const removePlayerBtn = document.getElementById('remove-player-btn');
    const playerInputsContainer = document.querySelector('.player-inputs');
    
    let playerCount = 2; // Start with 2 players
    
    // Add player button
    addPlayerBtn.addEventListener('click', () => {
        if (playerCount < 5) { // Maximum 5 players
            playerCount++;
            
            const playerInput = document.createElement('div');
            playerInput.className = 'player-input';
            playerInput.innerHTML = `
                <label for="player${playerCount}">Player ${playerCount}:</label>
                <input type="text" id="player${playerCount}" placeholder="Nickname" required>
                <div class="pawn-color" style="background-color: ${PLAYER_COLORS[playerCount - 1]};">${playerCount}</div>
            `;
            
            playerInputsContainer.appendChild(playerInput);
            
            // Enable remove button if we now have more than 2 players
            if (playerCount > 2) {
                removePlayerBtn.disabled = false;
            }
            
            // Disable add button if we reached the maximum
            if (playerCount === 5) {
                addPlayerBtn.disabled = true;
            }
        }
    });
    
    // Remove player button
    removePlayerBtn.addEventListener('click', () => {
        if (playerCount > 2) { // Minimum 2 players
            const lastPlayer = playerInputsContainer.lastElementChild;
            playerInputsContainer.removeChild(lastPlayer);
            playerCount--;
            
            // Disable remove button if we now have only 2 players
            if (playerCount === 2) {
                removePlayerBtn.disabled = true;
            }
            
            // Enable add button if we're below the maximum
            if (playerCount < 5) {
                addPlayerBtn.disabled = false;
            }
        }
    });
}

// Start the online game with the entered players
function startOnlineGame() {
    // Get player nicknames
    const playerInputs = document.querySelectorAll('.player-input input');
    const playerNames = [];
    
    // Validate player names
    let allValid = true;
    playerInputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.border = '2px solid red';
            allValid = false;
        } else {
            playerNames.push(input.value.trim());
            input.style.border = '';
        }
    });
    
    if (!allValid) {
        return; // Don't start if any names are missing
    }
    
    // Get selected game mode
    const gameModeRadios = document.querySelectorAll('input[name="game-mode"]');
    gameModeRadios.forEach(radio => {
        if (radio.checked) {
            onlineGameMode = radio.value;
        }
    });
    
    // Initialize players
    onlinePlayers = playerNames.map((name, index) => ({
        name,
        position: 0, // Start at position 0 (start square)
        color: PLAYER_COLORS[index],
        skipNextTurn: false,
        playerNumber: index + 1
    }));
    
    // Generate the board layout
    boardLayout = generateBoardLayout();
    
    // Hide setup form and show game board
    document.getElementById('player-setup').style.display = 'none';
    document.getElementById('board-game-container').style.display = 'block';
    
    // Initialize the game board UI
    createGameBoard();
    updateGameStatusUI();
    onlineGameStarted = true;
    
    // Start with player 1
    currentPlayerIndex = 0;
    updateCurrentPlayer();
}

// Create the visual game board with squares and pawns
function createGameBoard() {
    const boardGridElement = document.getElementById('game-board-grid');
    const playersListElement = document.getElementById('players-list');
    
    // Clear any existing content
    boardGridElement.innerHTML = '';
    playersListElement.innerHTML = '';
    
    // Create board squares in snake-like pattern
    const rows = Math.ceil(Math.sqrt(boardSize));
    const cols = Math.ceil(boardSize / rows);
    
    let squareIndex = 0;
    
    // Generate grid in snake pattern
    for (let row = 0; row < rows; row++) {
        const rowDirection = row % 2 === 0 ? 1 : -1; // Left-to-right or right-to-left
        const startCol = row % 2 === 0 ? 0 : cols - 1;
        
        for (let i = 0; i < cols; i++) {
            const col = startCol + (i * rowDirection);
            
            if (squareIndex < boardSize) {
                const squareType = boardLayout[squareIndex];
                const symbol = getSquareSymbol(squareType);
                
                const square = document.createElement('div');
                square.className = `board-square ${squareType}`;
                square.dataset.index = squareIndex;
                
                // Add square number and symbol
                const squareNum = document.createElement('span');
                squareNum.className = 'board-square-number';
                squareNum.textContent = squareIndex + 1;
                square.appendChild(squareNum);
                
                // Add symbol
                square.innerHTML += symbol;
                
                // Add pawn container for players
                const pawnContainer = document.createElement('div');
                pawnContainer.className = 'pawn-container';
                pawnContainer.id = `square-${squareIndex}-pawns`;
                square.appendChild(pawnContainer);
                
                boardGridElement.appendChild(square);
                squareIndex++;
            }
        }
    }
    
    // Create player status list
    onlinePlayers.forEach(player => {
        const playerStatus = document.createElement('div');
        playerStatus.className = 'player-status';
        playerStatus.id = `player-status-${player.playerNumber}`;
        
        playerStatus.innerHTML = `
            <div class="pawn player${player.playerNumber}"></div>
            <span class="player-name">${player.name}</span>
            <span class="player-position">Start</span>
        `;
        
        playersListElement.appendChild(playerStatus);
    });
    
    // Place all players at the start
    placePawnsOnBoard();
}

// Get special symbol for square type
function getSquareSymbol(squareType) {
    switch (squareType) {
        case BOARD_SQUARE_TYPES.QUESTION:
            return '?';
        case BOARD_SQUARE_TYPES.EXCLAMATION:
            return '!';
        case BOARD_SQUARE_TYPES.BELL:
            return '🔕';
        case BOARD_SQUARE_TYPES.WEB:
            return '🕸️';
        case BOARD_SQUARE_TYPES.START:
            return 'START';
        case BOARD_SQUARE_TYPES.FINISH:
            return 'END';
        default:
            return '';
    }
}

// Place player pawns on their current positions
function placePawnsOnBoard() {
    // First clear all pawn containers
    document.querySelectorAll('.pawn-container').forEach(container => {
        container.innerHTML = '';
    });
    
    // Group players by position to handle multiple players on the same square
    const playersByPosition = {};
    
    onlinePlayers.forEach(player => {
        if (!playersByPosition[player.position]) {
            playersByPosition[player.position] = [];
        }
        playersByPosition[player.position].push(player);
    });
    
    // Place pawns on the board
    for (const [position, players] of Object.entries(playersByPosition)) {
        const pawnContainer = document.getElementById(`square-${position}-pawns`);
        
        if (pawnContainer) {
            // Add multiple-pawns class if more than one player
            if (players.length > 1) {
                pawnContainer.classList.add('multiple-pawns');
            }
            
            // Add each player's pawn
            players.forEach(player => {
                const pawn = document.createElement('div');
                pawn.className = `pawn player${player.playerNumber}`;
                pawnContainer.appendChild(pawn);
            });
        }
    }
}

// Update current player in the UI
function updateCurrentPlayer() {
    const currentPlayer = onlinePlayers[currentPlayerIndex];
    
    // Update player info display
    document.getElementById('current-player-name').textContent = currentPlayer.name;
    
    const currentPlayerPawn = document.getElementById('current-player-pawn');
    currentPlayerPawn.className = `pawn player${currentPlayer.playerNumber}`;
    
    // Highlight the current player in the list
    document.querySelectorAll('.player-status').forEach(status => {
        status.classList.remove('active');
    });
    
    document.getElementById(`player-status-${currentPlayer.playerNumber}`).classList.add('active');
    
    // Check if player must skip turn
    if (currentPlayer.skipNextTurn) {
        document.getElementById('game-message').textContent = `${currentPlayer.name} must skip this turn!`;
        document.getElementById('roll-dice-btn').disabled = true;
        
        // Reset the skip flag and move to next player automatically after a delay
        setTimeout(() => {
            currentPlayer.skipNextTurn = false;
            document.getElementById(`player-status-${currentPlayer.playerNumber}`).classList.remove('skipping');
            nextTurn();
        }, 1500);
    } else {
        document.getElementById('game-message').textContent = `${currentPlayer.name}'s turn to roll the dice!`;
        document.getElementById('roll-dice-btn').disabled = false;
    }
    
    // Hide answer buttons and disable draw card
    document.getElementById('answer-correct-btn').style.display = 'none';
    document.getElementById('answer-wrong-btn').style.display = 'none';
    document.getElementById('draw-card-btn').disabled = true;
}

// Roll the dice and move the player
function rollDice() {
    if (diceRolling || waitingForAnswer) return;
    
    diceRolling = true;
    const diceElement = document.getElementById('dice');
    const diceCube = document.querySelector('.dice-cube');
    
    // Disable the roll button during rolling
    document.getElementById('roll-dice-btn').disabled = true;
    
    // Add rolling animation class
    diceElement.classList.add('rolling');
    
    // Generate random rotations for 3D effect
    const randomRotations = [
        Math.floor(Math.random() * 360),
        Math.floor(Math.random() * 360),
        Math.floor(Math.random() * 360)
    ];
    
    // Play rolling animation with random numbers
    let rollCount = 0;
    const rollInterval = setInterval(() => {
        // Apply random rotation to the dice cube
        diceCube.style.transform = `rotateX(${randomRotations[0]}deg) rotateY(${randomRotations[1]}deg) rotateZ(${randomRotations[2]}deg)`;
        
        rollCount++;
        if (rollCount >= 10) { // Stop after 10 iterations
            clearInterval(rollInterval);
            
            // Set final roll value and face
            lastDiceRoll = Math.floor(Math.random() * 6) + 1;
            
            // Show the appropriate face based on the roll
            const rotations = getDiceRotation(lastDiceRoll);
            diceCube.style.transform = rotations;
            
            // Remove rolling animation class
            diceElement.classList.remove('rolling');
            
            // Move the player after a short delay
            setTimeout(() => {
                movePlayer(lastDiceRoll);
                diceRolling = false;
            }, 500);
        }
    }, 100);
}

// Get the rotation for a specific dice face/number
function getDiceRotation(number) {
    switch(number) {
        case 1: // Front face
            return 'rotateX(0deg) rotateY(0deg)';
        case 6: // Back face
            return 'rotateX(0deg) rotateY(180deg)';
        case 3: // Right face
            return 'rotateX(0deg) rotateY(90deg)';
        case 4: // Left face
            return 'rotateX(0deg) rotateY(-90deg)';
        case 5: // Top face
            return 'rotateX(90deg) rotateY(0deg)';
        case 2: // Bottom face
            return 'rotateX(-90deg) rotateY(0deg)';
        default:
            return 'rotateX(0deg) rotateY(0deg)';
    }
}

// Move the current player by the dice roll amount
function movePlayer(steps) {
    const currentPlayer = onlinePlayers[currentPlayerIndex];
    const newPosition = Math.min(currentPlayer.position + steps, boardSize - 1);
    
    // Move the player
    currentPlayer.position = newPosition;
    
    // Update the player status display
    updatePlayerPositions();
    
    // Place pawns on the board
    placePawnsOnBoard();
    
    // Check if reached the end
    if (newPosition === boardSize - 1) {
        document.getElementById('game-message').textContent = `${currentPlayer.name} reached the finish line!`;
        
        // Handle game end logic if this is the first player to finish
        const finishedPlayers = onlinePlayers.filter(p => p.position === boardSize - 1);
        if (finishedPlayers.length === 1) {
            // First player to reach the end
            setTimeout(() => {
                handleGameWinner(currentPlayer);
            }, 1000);
            return;
        }
    }
    
    // Check special square effect
    const squareType = boardLayout[newPosition];
    handleSpecialSquare(squareType);
}

// Update all player position displays
function updatePlayerPositions() {
    onlinePlayers.forEach(player => {
        const statusElement = document.getElementById(`player-status-${player.playerNumber}`);
        const positionElement = statusElement.querySelector('.player-position');
        
        if (player.position === 0) {
            positionElement.textContent = 'Start';
        } else if (player.position === boardSize - 1) {
            positionElement.textContent = 'Finish!';
        } else {
            positionElement.textContent = `Square ${player.position + 1}`;
        }
        
        // Mark players who will skip their next turn
        if (player.skipNextTurn) {
            statusElement.classList.add('skipping');
        } else {
            statusElement.classList.remove('skipping');
        }
    });
}

// Handle the special effects of different square types
function handleSpecialSquare(squareType) {
    const currentPlayer = onlinePlayers[currentPlayerIndex];
    
    switch (squareType) {
        case BOARD_SQUARE_TYPES.QUESTION:
            // Player must draw a question card
            document.getElementById('game-message').textContent = 
                `${currentPlayer.name} landed on a ? square. Draw a card!`;
            document.getElementById('draw-card-btn').disabled = false;
            break;
            
        case BOARD_SQUARE_TYPES.EXCLAMATION:
            if (onlineGameMode === 'normal') {
                // Move 3 spaces forward in normal mode
                document.getElementById('game-message').textContent = 
                    `${currentPlayer.name} can move 3 spaces forward!`;
                    
                setTimeout(() => {
                    movePlayer(3);
                }, 1000);
            } else {
                // In hard mode, player chooses someone to draw a card
                document.getElementById('game-message').textContent = 
                    `${currentPlayer.name} can choose a player to draw a card (click their name)`;
                    
                // Enable selecting other players
                enablePlayerSelection();
            }
            break;
            
        case BOARD_SQUARE_TYPES.BELL:
            // Next player skips a turn
            const nextPlayerIndex = (currentPlayerIndex + 1) % onlinePlayers.length;
            const nextPlayer = onlinePlayers[nextPlayerIndex];
            nextPlayer.skipNextTurn = true;
            
            document.getElementById('game-message').textContent = 
                `${nextPlayer.name} will skip their next turn!`;
                
            // Update player status display
            updatePlayerPositions();
            
            // Continue to next turn after a delay
            setTimeout(() => {
                nextTurn();
            }, 1500);
            break;
            
        case BOARD_SQUARE_TYPES.WEB:
            // Current player skips their next turn
            currentPlayer.skipNextTurn = true;
            
            document.getElementById('game-message').textContent = 
                `${currentPlayer.name} will skip their next turn!`;
                
            // Update player status display
            updatePlayerPositions();
            
            // Continue to next turn after a delay
            setTimeout(() => {
                nextTurn();
            }, 1500);
            break;
            
        case BOARD_SQUARE_TYPES.FINISH:
            // Handle in movePlayer function
            break;
            
        default: // Normal square
            // Just move to next turn
            setTimeout(() => {
                nextTurn();
            }, 1000);
    }
}

// Enable clicking on player names to choose who draws a card (hard mode)
function enablePlayerSelection() {
    const currentPlayer = onlinePlayers[currentPlayerIndex];
    const playerStatuses = document.querySelectorAll('.player-status');
    
    playerStatuses.forEach(status => {
        if (!status.classList.contains('active')) { // Not the current player
            status.style.cursor = 'pointer';
            status.onclick = function() {
                // Get the selected player's number
                const playerNum = parseInt(this.id.replace('player-status-', ''));
                const selectedPlayer = onlinePlayers.find(p => p.playerNumber === playerNum);
                
                // Disable selection
                disablePlayerSelection();
                
                // Show message
                document.getElementById('game-message').textContent = 
                    `${selectedPlayer.name} must draw a card!`;
                
                // Enable draw card button
                document.getElementById('draw-card-btn').disabled = false;
                
                // Store the selected player as the one who will answer
                selectedPlayerIndex = onlinePlayers.indexOf(selectedPlayer);
            };
        }
    });
}

// Disable player selection mode
function disablePlayerSelection() {
    const playerStatuses = document.querySelectorAll('.player-status');
    
    playerStatuses.forEach(status => {
        status.style.cursor = '';
        status.onclick = null;
    });
}

// Draw a card in online game mode
function drawOnlineCard() {
    // Disable the draw button
    document.getElementById('draw-card-btn').disabled = true;
    
    // Determine the card type based on the square type
    const currentPlayer = onlinePlayers[currentPlayerIndex];
    const currentSquareType = boardLayout[currentPlayer.position];
    
    // If it's a question square, draw a question card
    // Otherwise, draw a random card (question or action)
    const cardType = currentSquareType === BOARD_SQUARE_TYPES.QUESTION ? 'question' : 
                    (Math.random() > 0.5 ? 'question' : 'action');
    
    // Get a random card from the appropriate deck
    const availableCards = gameData.cards.filter(card => card.type === cardType);
    
    if (availableCards.length === 0) {
        document.getElementById('game-message').textContent = 'No cards available!';
        return;
    }
    
    // Pick a random card
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    drawnCard = availableCards[randomIndex];
    
    // Display the card overlay
    const cardDisplay = document.getElementById('online-card-display');
    cardDisplay.innerHTML = ''; // Clear previous cards
    
    // Create overlay container for the card
    const overlayContainer = document.createElement('div');
    overlayContainer.className = 'card-overlay';
    
    // Create the card element but don't show the answer yet for question cards
    const cardElement = createCardElement(drawnCard, drawnCard.type === 'question'); // Hide answer for question cards
    cardElement.classList.add('drawn-online-card'); // Add specific class for styling
    
    overlayContainer.appendChild(cardElement);
    
    // For question cards, add answer buttons INSIDE the overlay container
    if (drawnCard.type === 'question') {
        waitingForAnswer = true;
        
        // Create a button container inside the overlay
        const answerButtonsContainer = document.createElement('div');
        answerButtonsContainer.className = 'answer-buttons-container';
        
        // Create new answer buttons that will be inside the overlay
        const answerCorrectBtn = document.createElement('button');
        answerCorrectBtn.id = 'overlay-answer-correct-btn';
        answerCorrectBtn.className = 'answer-btn correct-btn';
        answerCorrectBtn.textContent = 'Correct';
        answerCorrectBtn.onclick = () => handleAnswer(true);
        
        const answerWrongBtn = document.createElement('button');
        answerWrongBtn.id = 'overlay-answer-wrong-btn';
        answerWrongBtn.className = 'answer-btn wrong-btn';
        answerWrongBtn.textContent = 'Wrong';
        answerWrongBtn.onclick = () => handleAnswer(false);
        
        // Add buttons to the container
        answerButtonsContainer.appendChild(answerCorrectBtn);
        answerButtonsContainer.appendChild(answerWrongBtn);
        
        // Add the button container to the overlay
        overlayContainer.appendChild(answerButtonsContainer);
        
        // Hide the original buttons outside the overlay
        document.getElementById('answer-correct-btn').style.display = 'none';
        document.getElementById('answer-wrong-btn').style.display = 'none';
    } else {
        waitingForAnswer = false;
        // For action cards, we'll handle as before
    }
    
    // Finally add the overlay container to the display
    cardDisplay.appendChild(overlayContainer);
    
    // Make sure card is visible
    cardDisplay.style.display = 'flex';
    
    // Update game message
    document.getElementById('game-message').textContent = 
        `${currentPlayer.name} drew a ${drawnCard.type} card!`;
    
    // For action cards, apply action effect based on content
    if (drawnCard.type !== 'question') {
        document.getElementById('game-message').textContent += " Action applied!";
        
        // Parse the action content for movement
        let spacesToMove = 0;
        const actionContent = drawnCard.content.toLowerCase();
        
        if (actionContent.includes('spaces forward')) {
            // Extract the number before 'spaces forward'
            const match = actionContent.match(/(\d+)\s+spaces?\s+forward/);
            if (match && match[1]) {
                spacesToMove = parseInt(match[1]);
            }
        } else if (actionContent.includes('spaces back')) {
            // Extract the number before 'spaces back'
            const match = actionContent.match(/(\d+)\s+spaces?\s+back/);
            if (match && match[1]) {
                spacesToMove = -parseInt(match[1]); // Negative for moving backward
            }
        }
        
        // Apply movement after a delay to allow reading the card
        if (spacesToMove !== 0) {
            document.getElementById('game-message').textContent += 
                ` Moving ${Math.abs(spacesToMove)} spaces ${spacesToMove > 0 ? 'forward' : 'backward'}!`;
            
            setTimeout(() => {
                // Move player by the specified amount
                const newPosition = Math.max(0, Math.min(boardSize - 1, currentPlayer.position + spacesToMove));
                currentPlayer.position = newPosition;
                
                // Update the player status display
                updatePlayerPositions();
                
                // Place pawns on the board
                placePawnsOnBoard();
                
                // Check if reached the end
                if (newPosition === boardSize - 1) {
                    document.getElementById('game-message').textContent = `${currentPlayer.name} reached the finish line!`;
                    
                    // Handle game end logic if this is the first player to finish
                    const finishedPlayers = onlinePlayers.filter(p => p.position === boardSize - 1);
                    if (finishedPlayers.length === 1) {
                        setTimeout(() => {
                            handleGameWinner(currentPlayer);
                        }, 1000);
                        return;
                    }
                }
                
                // Move to next turn after allowing time to see the movement
                setTimeout(() => {
                    // Remove the overlay
                    removeCardOverlay();
                    nextTurn();
                }, 2000);
            }, 2000);
        } else {
            // If no movement specified, just move to next turn
            setTimeout(() => {
                removeCardOverlay();
                nextTurn();
            }, 3000);
        }
    }
}

// Handle the player's answer (correct or wrong)
function handleAnswer(isCorrect) {
    const currentPlayer = onlinePlayers[currentPlayerIndex];
    
    // Reveal the answer first
    const cardAnswerSection = document.querySelector('.card-answer.hidden-answer');
    if (cardAnswerSection) {
        cardAnswerSection.classList.remove('hidden-answer');
        const showAnswerBtn = cardAnswerSection.querySelector('.show-answer-btn');
        if (showAnswerBtn) {
            showAnswerBtn.style.display = 'none';
        }
    }
    
    // Hide answer buttons
    document.getElementById('answer-correct-btn').style.display = 'none';
    document.getElementById('answer-wrong-btn').style.display = 'none';
    
    // Add visual feedback for the answer
    const drawnCardElement = document.querySelector('.drawn-online-card');
    if (drawnCardElement) {
        drawnCardElement.classList.add(isCorrect ? 'correct-answer' : 'wrong-answer');
    }
    
    if (isCorrect) {
        // If correct, player stays on square
        document.getElementById('game-message').textContent = 
            `${currentPlayer.name} answered correctly and stays on square ${currentPlayer.position + 1}!`;
    } else {
        // If wrong, player moves back 2 spaces
        document.getElementById('game-message').textContent = 
            `${currentPlayer.name} answered incorrectly and moves back 2 spaces!`;
            
        // Move player back (minimum position is 0)
        currentPlayer.position = Math.max(0, currentPlayer.position - 2);
        
        // Update the player status display
        updatePlayerPositions();
        
        // Place pawns on the board
        placePawnsOnBoard();
    }
    
    waitingForAnswer = false;
    
    // Clear the card after a short delay
    setTimeout(() => {
        removeCardOverlay();
        nextTurn();
    }, 2000);
}

// Move to the next player's turn
function nextTurn() {
    // Move to the next player
    currentPlayerIndex = (currentPlayerIndex + 1) % onlinePlayers.length;
    updateCurrentPlayer();
    updateGameStatusUI();
}

// Handle when a player wins the game
function handleGameWinner(winner) {
    // Find the player who finished last
    const sortedPlayers = [...onlinePlayers].sort((a, b) => b.position - a.position);
    const lastPlayer = sortedPlayers[sortedPlayers.length - 1];
    
    document.getElementById('game-message').textContent = 
        `${winner.name} won! They get to test ${lastPlayer.name} with a question card.`;
        
    // Disable dice rolling
    document.getElementById('roll-dice-btn').disabled = true;
    
    // Enable drawing a final card for the last player
    document.getElementById('draw-card-btn').disabled = false;
}

// Update the overall game status UI
function updateGameStatusUI() {
    // Update any additional game status indicators here
}

// End the online game and return to the main menu
function endOnlineGame() {
    // Hide the online game container
    document.getElementById('online-game-container').style.display = 'none';
    
    // Reset the online game state
    onlineGameStarted = false;
    onlinePlayers = [];
    currentPlayerIndex = 0;
    waitingForAnswer = false;
    
    // Reset the UI for next time
    document.getElementById('player-setup').style.display = 'block';
    document.getElementById('board-game-container').style.display = 'none';
    document.getElementById('online-card-display').innerHTML = '';
    
    // Reset player inputs
    const playerInputs = document.querySelectorAll('.player-input input');
    playerInputs.forEach(input => {
        input.value = '';
        input.style.border = '';
    });
}

// Define board layout pattern (for the special squares)
function generateBoardLayout() {
    // Start with all normal squares
    const layout = Array(boardSize).fill(BOARD_SQUARE_TYPES.NORMAL);
    
    // Set start and finish
    layout[0] = BOARD_SQUARE_TYPES.START;
    layout[boardSize - 1] = BOARD_SQUARE_TYPES.FINISH;
    
    // Add special squares in a pattern similar to the image
    // Question marks - every 5th square
    for (let i = 5; i < boardSize; i += 5) {
        if (i !== boardSize - 1) { // Avoid changing the finish square
            layout[i] = BOARD_SQUARE_TYPES.QUESTION;
        }
    }
    
    // Exclamation marks - every 7th square
    for (let i = 7; i < boardSize; i += 7) {
        if (i !== boardSize - 1 && layout[i] === BOARD_SQUARE_TYPES.NORMAL) { // Avoid changing finish or already special squares
            layout[i] = BOARD_SQUARE_TYPES.EXCLAMATION;
        }
    }
    
    // Bell squares - specific positions
    [12, 24, 36].forEach(pos => {
        if (pos < boardSize && layout[pos] === BOARD_SQUARE_TYPES.NORMAL) {
            layout[pos] = BOARD_SQUARE_TYPES.BELL;
        }
    });
    
    // Web squares - specific positions
    [18, 30, 42].forEach(pos => {
        if (pos < boardSize && layout[pos] === BOARD_SQUARE_TYPES.NORMAL) {
            layout[pos] = BOARD_SQUARE_TYPES.WEB;
        }
    });
    
    return layout;
}

// Remove the card overlay
function removeCardOverlay() {
    const cardDisplay = document.getElementById('online-card-display');
    cardDisplay.style.display = 'none';
    cardDisplay.innerHTML = '';
}