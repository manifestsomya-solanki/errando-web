import Picker, {
  EmojiClickData,
  EmojiStyle,
  SkinTones,
  Theme,
} from "emoji-picker-react";
import { useTheme } from "../../store/theme-context";

function EmojiKyeboard(props: { onChange: (emojiObject: any) => void }) {
  const onEmojiClick = (emoji: EmojiClickData, e: any) => {
    props.onChange(emoji);
  };
  const { theme } = useTheme();
  return (
    <div className="absolute bottom-16 right-0">
      <Picker
        emojiStyle={EmojiStyle.APPLE}
        theme={theme === "light" ? Theme.LIGHT : Theme.DARK}
        defaultSkinTone={SkinTones.LIGHT}
        onEmojiClick={(emoji: EmojiClickData, e) => onEmojiClick(emoji, e)}
        previewConfig={{ showPreview: false }}
      />
    </div>
  );
}

export default EmojiKyeboard;
