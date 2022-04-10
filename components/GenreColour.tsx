import { useEffect, useState } from "react";

interface Props {
  genre: string;
  quantity?: number;
}

const GenreColour: React.FC<Props> = ({ genre, quantity }) => {
  const [colour, setColour] = useState("none");
  const [textColour, setTextColour] = useState("white")

  useEffect(() => {
    if (genre.indexOf("soul") > -1 || genre.indexOf("r&b") > -1) {
      setColour("soul");
      setTextColour("darkgrey")
    } else if (genre.indexOf("country") > -1) {
      setColour("country");
      setTextColour("darkgrey")
    } else if (
      genre.indexOf("electro") > -1 ||
      genre.indexOf("edm") > -1 ||
      genre.indexOf("house") > -1
    ) {
      setColour("electronic");
    } else if (genre.indexOf("indie") > -1 || genre.indexOf("alt") > -1) {
      setColour("indie");
      setTextColour("darkgrey")
    } else if (genre.indexOf("folk") > -1) {
      setColour("folk");
    } else if (genre.indexOf("rap") > -1 || genre.indexOf("hip hop") > -1) {
      setColour("rap");
      setTextColour("darkgrey")
      setTextColour("darkgrey")
    } else if (genre.indexOf("jazz") > -1) {
      setColour("jazz");
    } else if (genre.indexOf("rock") > -1) {
      setColour("rock");
    } else if (genre.indexOf("metal") > -1) {
      setColour("metal");
      setTextColour("darkgrey")
    } else if (genre.indexOf("classical") > -1) {
      setColour("classical");
      setTextColour("darkgrey")
    } else if (genre.indexOf("pop") > -1) {
      setColour("pop");
    }
  }, [genre]);

  return (
    <div className="my-2">
      <span className={`${colour != "none" ? `bg-${colour}` : "border-2 border-lightgrey2"} rounded-full text-center px-3 py-1.5 text-${textColour} font-semibold`}>{genre}</span>
      {quantity && <span className="ml-2 font-semibold">{quantity}</span>}
    </div>
  );
};

export default GenreColour;
