import del from 'rollup-plugin-del'
export default [
  {
    input: "./index.js",
    output: {
      file: "../../build/@common/index.esm.js",
      format: 'es'
    },
    plugins:[
      del()
    ]
  },
];
