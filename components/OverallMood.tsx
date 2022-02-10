
interface Props {
  features: string[][];
  playlistId: string;
}

const OverallMood: React.FC<Props> = ({ features, playlistId }) => {
  return (
    <div className="flex flex-col w-10/12 mx-auto">
      {features.map((feature) => (
        <div key={feature[0] + playlistId} className="group my-2">
          <div className="text-lg font-medium text-text">{feature[0]}</div>
          <div className="duration-300 group-hover:h-7 group-hover:mb-4 h-3 bg-gray-600 rounded-lg mt-0.5">
            <div
              className="duration-300 group-hover:h-7 h-3 bg-gray-400 rounded-lg mb-1.5"
              style={{ width: feature[1] }}
            ></div>
            <span className="duration-300 hidden group-hover:inline font-bold">{feature[1].slice()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverallMood;
