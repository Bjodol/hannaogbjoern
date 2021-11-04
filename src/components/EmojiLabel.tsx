import classNames from "classnames";

type EmojiLabelProps = {
  emoji: string;
};

export const EmojiLabel: React.FC<
  EmojiLabelProps & JSX.IntrinsicElements["div"]
> = ({ children, className, emoji, ...rest }) => (
  <div className={classNames("flex", className)} {...rest}>
    <span className="w-8 flex justify-center items-center">{emoji}</span>
    {children}
  </div>
);
