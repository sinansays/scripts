set imageFolder to (POSIX file (POSIX path of (path to home folder) & "stitcher/")) as alias

tell application "Finder"
	set imageFiles to files of imageFolder whose name extension is "png"
end tell

tell application "Keynote"
	activate
	set newDoc to make new document with properties {document theme:theme "White"}
	
	-- Default slide dimensions for a standard 16:9 Keynote slide
	set slideWidth to 1920
	set slideHeight to 1080
	
	repeat with img in imageFiles
		try
			-- Convert the Finder file reference to an alias
			set imgAlias to img as alias
			
			-- Add a new slide with a blank layout
			tell newDoc
				set thisSlide to make new slide with properties {base layout:slide layout "Blank"}
				
				-- Insert the image on the slide
				tell thisSlide
					set thisImage to make new image with properties {file:imgAlias}
					
					-- Get the original image dimensions
					set imgWidth to width of thisImage
					set imgHeight to height of thisImage
					
				end tell
			end tell
		on error errMsg
			display dialog "Error with image " & (name of img) & ": " & errMsg
		end try
	end repeat
end tell
