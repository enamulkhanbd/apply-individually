// Initial load with a default height (will snap to correct size immediately)
figma.showUI(__html__, { width: 340, height: 500 }); 

figma.ui.onmessage = async (msg) => {

  // --- NEW: Resize Handler ---
  if (msg.type === 'resize') {
    figma.ui.resize(msg.width, msg.height);
    return;
  }

  // --- Existing Logic ---
  if (msg.type === 'apply-text') {
    
    let notificationHandler = null;

    try {
      // 1. Validation
      const selection = figma.currentPage.selection;
      const textNodes = selection.filter(node => node.type === "TEXT");

      if (textNodes.length === 0) {
        figma.notify("❌ Please select at least one Text layer.");
        return;
      }

      // 2. Parse List
      let rawList = [];
      if (msg.separator === 'space') {
        rawList = msg.textList.trim().split(/\s+/);
      } else if (msg.separator === 'newline') {
        rawList = msg.textList.trim().split(/\r?\n/);
      } else {
        rawList = msg.textList.split(',');
      }

      const textList = rawList.map(t => t.trim()).filter(t => t.length > 0);

      if (textList.length === 0) {
        figma.notify("❌ Text list is empty.");
        return;
      }

      notificationHandler = figma.notify(`Updating ${textNodes.length} layers...`, { timeout: Infinity });

      // 3. Optimization Vars
      const loadedFonts = new Set();
      let updatedCount = 0;
      let errorCount = 0;

      // 4. Casing Helper
      const applyCasing = (text, casingMode) => {
        if (!text) return "";
        if (casingMode === 'upper') return text.toUpperCase();
        if (casingMode === 'lower') return text.toLowerCase();
        if (casingMode === 'title') {
          return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        }
        return text;
      };

      // 5. Main Loop
      for (let i = 0; i < textNodes.length; i++) {
        const node = textNodes[i];
        
        try {
          if (node.hasMissingFont) {
            errorCount++;
            continue; 
          }

          // Handle Fonts
          let fontName = node.fontName;
          if (fontName === figma.mixed) {
             if (node.characters.length > 0) fontName = node.getRangeFontName(0, 1);
             else continue;
          }

          const fontKey = `${fontName.family}-${fontName.style}`;
          if (!loadedFonts.has(fontKey)) {
            await figma.loadFontAsync(fontName);
            loadedFonts.add(fontKey);
          }

          // Select Data
          let baseText = "";
          if (msg.mode === 'random') {
            baseText = textList[Math.floor(Math.random() * textList.length)];
          } else {
            baseText = textList[i % textList.length];
          }

          // Formatting with PREFIX & SUFFIX
          const casedText = applyCasing(baseText, msg.casing);
          const prefix = msg.prefix || "";
          const suffix = msg.suffix || ""; 
          
          const finalText = `${prefix}${casedText}${suffix}`;

          node.characters = finalText;
          updatedCount++;

        } catch (innerError) {
          console.error(`Error on layer "${node.name}":`, innerError);
          errorCount++;
        }
      }

      if (errorCount > 0) {
        figma.notify(`✅ Updated ${updatedCount}. (Skipped ${errorCount} errors)`);
      } else {
        figma.notify(`✅ Updated ${updatedCount} layers!`);
      }

    } catch (err) {
      console.error(err);
      figma.notify("❌ An error occurred.");
    } finally {
      if (notificationHandler) notificationHandler.cancel();
    }
  }
};