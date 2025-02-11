import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'


const __filename = import.meta.filename
const __dirname = import.meta.dirname
const name = 'Kirill'


export default async() => { 
    const response = await fetch('https://rickandmortyapi.com/api/character?page=19')
    const data = await response.json()
    const characters = data.results;
    const pages = [];
    characters.forEach(character => {
        let page = new HtmlWebpackPlugin({
            template: './src/character.njk',
            filename: `character_${character.id}.html`,
            templateParameters: {
                character,
            }
        });
        pages.push(page);
    });
    return {
        entry: './src/index.js',
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist')
        },
        devServer: {
            static: {
                directory: path.join(__dirname, 'public')
            },
            compress: true,
            port: 9000,
        },
        module: {
            rules: [
              {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
              },
              {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader", 
                    "css-loader", 
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                quietDeps: true
                            }
                        } 
                      }
                    ],
             
                },
                {
                    test: /\.njk$/,
                    use: [
                        {
                            loader: 'simple-nunjucks-loader',
                            options: {}
                        }
                    ]
                }
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.njk',
                templateParameters: {
                    name: name,
                    characters: characters,
                }
            }),
            new HtmlWebpackPlugin({
                template: './src/about.njk',
                filename: 'about.html'
            }),
            ...pages
        ],
    };
};
