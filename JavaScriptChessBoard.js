// chessboard.js v@VERSION
// https://github.com/oakmac/chessboardjs/
//
// Copyright (c) 2019, Chris Oakman
// Released under the MIT license
// https://github.com/oakmac/chessboardjs/blob/master/LICENSE.md

// start anonymous scope
;(function () {
  'use strict'

  var $ = window['jQuery']

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  var COLUMNS = 'abcdefgh'.split('')
  var DEFAULT_DRAG_THROTTLE_RATE = 20
  var ELLIPSIS = '…'
  var MINIMUM_JQUERY_VERSION = '1.8.3'
  var RUN_ASSERTS = true
  var START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
  var START_POSITION = fenToObj(START_FEN)

  // default animation speeds
  var DEFAULT_APPEAR_SPEED = 200
  var DEFAULT_MOVE_SPEED = 200
  var DEFAULT_SNAPBACK_SPEED = 60
  var DEFAULT_SNAP_SPEED = 30
  var DEFAULT_TRASH_SPEED = 100

  // use unique class names to prevent clashing with anything else on the page
  // and simplify selectors
  // NOTE: these should never change
  var CSS = {}
  CSS['alpha'] = 'alpha-d2270'
  CSS['black'] = 'black-3c85d'
  CSS['board'] = 'board-b72b1'
  CSS['chessboard'] = 'chessboard-63f37'
  CSS['clearfix'] = 'clearfix-7da63'
  CSS['highlight1'] = 'highlight1-32417'
  CSS['highlight2'] = 'highlight2-9c5d2'
  CSS['notation'] = 'notation-322f9'
  CSS['numeric'] = 'numeric-fc462'
  CSS['piece'] = 'piece-417db'
  CSS['row'] = 'row-5277c'
  CSS['sparePieces'] = 'spare-pieces-7492f'
  CSS['sparePiecesBottom'] = 'spare-pieces-bottom-ae20f'
  CSS['sparePiecesTop'] = 'spare-pieces-top-4028b'
  CSS['square'] = 'square-55d63'
  CSS['white'] = 'white-1e1d7'

  var piece_bB = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAFRElEQVR42u1cXWgcVRS+abNSddXqKlYbsUjVrEJVuhUV7a+tmNj6ooLSSkJjIK4gaB7FJC9B64P4kDzUtyxqKJG2UDAtlQURBCmWPlRttVSr4k9M2zSJbkgy13N2v4k328l0ZndmN3P3fvDB7Mydc8583P85s0IYGBgYGBgYGBgYLB5cR9xI7CS+SdyAcwYe8ALxJFEW8SSuGbjgNeKsIpoF2r/5WtrI5IwHiKOKcMU10D7HZdYYuS7HnqLatxBnUdagCIc8iGfzkJFrPq4iHvYh4DAxZmSbj4wPATNGrsuxi5hbYABRB5J/iTuNXO79oNsobPo/F9xE/MulBv5JvNHI5IwdxB+JMy4C8rXTxGeMXP/jduI+h6YqXZqxxD231bJwMQwcox7FcyrzN2zU15p4ceJen8K5CbkXNmum5g2XKZ7TvZ/VwuR6ibLiKEe4hYQ8DB9aYinx4xDEKxbxI11FfNuPeIlEQg4MDOTJxz5FfEs38R4jnvdTo1paWuTU1FSefOxTQB7ZH9VFvKuJB/w23XQ6PScgH5fQlPfDd+TxRCl9Wnt7+5yAfFxiv/i4DgJ+6aX2cT/X2toqOzo6ZFtbmxwcHJTT09N58jGf42tcxkOfaPv6Iuri3eG1tmQymbkal8vl8sJZlpUnH/M5+zqX9VELG6IsYOciELAzygIe9fqgATdhlUeiLODvpU6MAxpEJGKIJK7HfKykVUcZ05jiwYRjiGRayK1+J88BTKSdyDHcEtUtq/Ol1sASl3JONZBjuDaqzfjXEDYN/PKXKA8i+xeBgJ9GWcCdIW5feV2NvBRlAfldxWQVRLR9TWAfMtJIV1HAV3XYTOA52OcVFNH2cVRolBbMCZFnlQe04vF4fnoSBNmWmJ/NelZomIS5kXicH7ChocHKZrP5jYJywTbYFtuEeN+IQlK6lriZRUylUnJsbEwGBbbFNiFeQmiM57mW1NXVyaamJtnV1SW7u7vLIttgW2wTNfA5XcW7D9OKMAcSCz6SuonH88EDFRiJ1RdKWuXLPCzc8/6CJucRrtNJwF1VWMq9rIt4MersP8Coa8nwYbGvnp6e94UOyUbNzc3xoaGhr2SFwT7Ztw41cHljY+NIb2+v7O/vl319faGSfbCvZDLJfe5yHQS8gfhzfX29jMViFSH7Yp/wHXlcI8LJCbzSVGYYviMPztXrEMFkpPrJWOWtrDpdRmLOknqdOB6SkKqtS8Q3hIY500uw0H9PFD7XkiK4JHNmDrYTQuM0X1VM3ljgFz5/YP0640O8GdzD9w5hAyHyovHu7wrincTVxHuxqL8fm5sPEteKQuboenAT8UVRyJ0e9SHgKO7hezdj/289bK+FrzXwnUQsqxHbisWyU72KuBvN5iAxS/yaeIL4LfEU8QfiGeJPxHPE34gjxDE0OVlCU3Yqk4PNEfg4B59nEMMpxHQCMWaxucGxP1tp4biP2aeIMCuCGwAqea/99wH/iMI/gjxVkZWZErQlqvO+N8ypzydhTr5bKjSXq5aI6gupR4IWjxPFL2gq3kKfSWwOcjf5nRoQr1jEd4Pc1eYPnCev0BnnUGYcqwGV4+AEOKlwQrnnoih8wsofVX8oCq9CN+H4NK5dVGw62ZpQ/DnFMelh8OMyTwfdjFuJxzBqzSKY70ThPwz4j3BeIW7HfCxFfAhMYX7Gc7UtxG3EJoVb0UVwubuIy1xiWIYyKdyztcjWNvjYAJ9qHOsQ2w7Eugexf49nsUfkY+jvQ8FK4pMYjblm3C2inbzDsd+DZ2nGs60UBgYGBgYGBgYGBgbh4j9wZbBvRaSd0wAAAABJRU5ErkJggg==";
  var piece_bK = "data:image/png;base64,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";
  var piece_bN = "data:image/png;base64,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";
  var piece_bP = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAC0ElEQVR42u2cPWgUQRSAP82PRjQSBUHTWamgIIiiEkWtAgo2goggKWxEQ4SoCGJiIYrVlYKiKAEbG8EUFlbaBBQ7f2JjoyCRIMZfojcWc0uWMTHJ3k7yZuZ98Jrj2Fu+ezv3Zt7jQFEURVEURVEURVEURVGUgiwGzgJDwAjwCXgDXAPaVc/ULAC6gHHA1KJaC5OLPqBJdf0rr98RZ5zIv/YAWK7aJuiaRt5kIm9qJk6seeMzlJeP78Be1QfnCsjL3lvRLLS/tqZgvACWpS5wZJbZl49vQJsKVIF18bKOR/g10Jq6wMsFxOVLmebUBbYWzL5fQKcWMXCpjkf4durbt0qBGtDdIw8CjSkK7K0j89y18H5qBfX2gtu3/0nsS0ng25Lk5eMdsDEFeYc8yMuudR5YGLvApyWKcwU+B5bGLG8F8Lnk7HMj6mP/fcBXTwKzax6MWeBR4IfH7DPA6ZgFHgd+ehZ4MWaBh7FH8T4FnoxZ4Fbgiydx2Rq4K2aBDcBHj9n3mwQOWO95LKQfAi2xC9zgQWAWx1LZC9/1IPEZsCoVgW3A+xLljdX22EnRie2qlSHwSmryVgMDJQocBDpSkbffOVAo60B1DOiOXV4PU8/9lSHRYAcxG2KU1wv88VhE57+UO8CSmOSdqu0SfNV/k2XjDWBRLGuemSN5bvRg26fB0o7/E+jp1sRNocprwvZr5yPz8p85TKDzMwfm4PB0NpOsQdECPJ7H7HNjFFgfksAOQfKy+7geksAnwgQa4BWwNgR56wRJc+NICAIrArMvu5eBEIrrD4IzcBThPZPN2K5bVaC87J62SRbYjZ1dNoIFXpUs8JbgxzeLIanymoFHAQisShW4BtsZky7P1FoKIuu/4QAy0AA7JQrcIryEEV9Q78D+QUQIAk9IFLgbf5NXZccZiQL3YFuLIQi8IFFgI3aIfGUAEf0El6IoiqIoiuKfv3U5xct5ETXIAAAAAElFTkSuQmCC";
  var piece_bQ = "data:image/png;base64,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";
  var piece_bR = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAACs0lEQVR42u2bMWtaURiGL60V4YoUmiXQP+Av6OAgKrQdLk6aTB2cpLFjp0JQsNLuIhmyZe2ge8ChuuYHNKtTYoYsYtPiOT3f7Se9SiNcTa7fkfeBlxuI537vfTQSk3scBwAAAAAAAAAAAADYyQuTisn7e3Jksr/B+nkq/Nj72OdZ667fGmcmdyvy2+Ryg/XBnK04zyXPWnf9Vkia9E30iig+rrs+mD6v+R/BWeusFytQBwQmA3H5x24QQuCA17hL53Ie4AkQL/CcHxsMCbkNIfCW1yyf53zXBaoNv/9Q57D6FSghEAiBEPiPWCzm2iaQO4vhued536fTqZYOdaSu1FmSwKelUum02+3qfr9PUXyUFL9Tr9fT5XL5lDpL+zSyl0qlvrquq5PJJEXxUUL8LtTNdPwi7rNwPB6ff/nE5CDk72SPnWCHA+4Y7CyS1yZXVLpYLKpWq6UbjUakoZk0m8VdcSereGXyYzQa+W/es9ks0hA0mzpwFyv5nE6ndaFQ0LlcLtLQTJpNHWz+I+uxgPfAYwiEQAiEQAiEQAiEQAiEQAiEQAiEQAiEQAiEQAiEQAiEQAiEwEfmUz6f181mU9fr9UhDM2k2dbBZ4GAymfj/YlRKRRqCZjt/72S1kncmvzKZjKrVarparUYamkmzqQN3sYo9kwtHzu1sF9zJCl6afGu323o8HosIdaFO3E081/SsdzodZcorAQIVdeFX4rUNAqXclRVmo484gZIDgRAIgasFJhIJLej2Xj/USaLAt87i3txKNpvVw+FQ2g3mfifq5izuST7ia9gKb0xunMV9uD89zxO7xYG6Ucelzjd8LZHzgQtoy3PH1xI5tR0SWINACIRACAzJ4Q7Im+dwGwJpv+1HkxOTjqU54WvY2t5h2ndGm86eWZo4XwMAAAAAAACh+APSjxzHQG+afwAAAABJRU5ErkJggg==";

  var piece_wB = "data:image/png;base64,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";
  var piece_wK = "data:image/png;base64,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";
  var piece_wN = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAJG0lEQVR42u1ceXBNVxhPhERCbWEsSZGQDh2UtqPGGrsY7RAMXUzHFLW0jJT2D4x2pgwxSFQNNUlDLbVNoyFb1TKmEVXCoMMoaomlSYSoNXG/nt/pOc/JEVnffe8+ub+Z3+S57757zv3d75zzne/7Li8vGzZs2LBhw4YNGzZs2LBh4xlEML5agfNTGW8xzmesUZ2FC2K8xkiCGxkblnH+BXGuIf6Orc4CTmV8rIgB/sLYoIRzgxmzFPHkb/6qzgJGQcAaNWpQvXr1VKtK0s7DMN0mRR40aBBNmjSJFNEbVlcBZ0JAPz8/WrBgAXXv3l1aVhHjV8p546RY3bp1M4qKimjTpk2q4H2rq4ATGB/WqlWLVq5cSVlZWdSgQQNpVXmM3wgh7+JY3bp16caNGwQkJSWRt7e3PDeWMYyxEeNLjH7VRcAujP/CkoYMGcKFWbx4MWlzoqQRHR1NT5484eft2bOHateurZ8Lyz3BuI5xMmNPxiYvuoh/4OYbN25Mhw4d4uKMHTtWF4969epFV65cIQl87t+/v6GtyDrzGTMZYxhff1EF/A03GxQUREePHuXiPHjwgHJychzMzc2lu3fvkmEYDgHxGcfY94UnTpygDRs20IwZM6hLly4lCfpEWHoaY9sXSbzXxPxm9OnTh27fvk0VgfE/+Ef1OIZ5YmIiDR8+nAIDA8nX19fQRI1jbOzp4tVk3IobgxuD+U1aVlWg//7WrVu0evVqDHdiq70qJBz4Dz15JzNBONHUrl07PmyfJ4IzxLx//z4lJydT7969SVt0fvDEVRsT+iO5AJw8edIx9zlbRB0QctWqVfo8mSVcII9ALdU1SUhI4DeGISyPHz9+nMyCfDAHDhyg5s2bq0IeYmzqCQLGS/GmTZvGbyYmJqaY+zFixAhyBQ4fPkytWrVS205krGNl8fox3od47du357sKuCC6/zZlyhRThYMVSkuEtbMdjjqcE6wqnj9jCjrJtm4Gtm4AAgO6gNKhNhtSxP379+tz4udWFDBSrHrUsWNH3vE7d+5Q/fr1i4nXtWtXUxeRkkQsLCykWbNmkbKrecD4hpXEq8v4u+zgkSNHeOfPnDlD/v7+DvGaNGlCZ8+erbLvVxnxL126RJhWlIeZbqX5cLLs2PTp04t1HAsGjoeGhvIAQWUFKCgooM2bN1N2dnalrXHFihXk4+Ojbv/etcrcx32+pk2bGjdv3iwm0r179/hikp+f74i0VBSIDy5ZsoTfeEhISIUfgnpu27Zt1fnwGGOAuwX8Xg7d2NjYZ0TSAwSVwaNHjwgukbTyqiwoW7duJS3CE+lO8d5EwBSd6dSpU7FwlDMXAexgEE+U82hlH4b8TVhYmCrgOXeJ58P4IzrB5hUDzrJZbsjp06cd1jd+/PgqX2/Hjh26FQ5zh4CIBt9BB1q3bm3KHldeq2fPng4BkRaoKvLy8ig4OFjf5rkUiG6sl08RT9SsKMuyZcsc4kVERPBFqartPH78mKKiolQrLGBs50oBO8ub6tGjh2mOcWpqKnY1DgGnTp3KFxRnYPfu3apLg7DbF64U8Ff59I4dO2aK9WVmZvI0gLqLQa744cOHTmnn4sWL1KFDB/X6SSII7JK5jzc6ZswYvkI6W7zz58/z1VaZo/hfuDLOskAgMjJSFfAM4yuuEPAwGvT19aW0tDSnz3lYJERoXt7YBvl59uzZfP5yVntLly6lmjVrqsM4wmzxBoiNuDFw4ECeNavq6qv+DosRqhi05FBr+W81b+wMYJpAMl+x9M8Yvc0UcL20vvj4+FLjcBUVb+HChVSnTh01KRQrfM3+UkCkNp0NZPWUNlGfU9ss8cLEPEHNmjXjjW/fvp1atmzJuW3btgpZonreyJEj9YqsOUq7s3EMlpmenu50AbUk1N+M9c0S8B3Z0Ny5c/m2DRt7eQzRFoSvKiIcFgtk7JQbQFDiA63dFHn9U6dOOV3AefPm6QHf5maIh9zqXLkiXr58mTIyMooFS1E0dPDgwXKJh+jKunXrUO6hWh2sO7yESA8qVQ1YCgK0zgb8QW1b97ZZmbZYNRqChLZq/viMY2XlKK5evUqjR4/mYX/lqSMBH1pCu+/LRQtOtBlAWYlmgV+bVWUQLRuRKyFifMjBgvhcVtR4165dfP7U8hMfiwekA6vhTzgHUe2UlBTTdjyKKwMmmyEgbiZKNnLu3LlnOgFR9+3bR/Pnz6edO3fyYap+h4JJUcMiBTzL+FYpbfZgzMH5CIKaic6dO6sCXjNrERkhG4mLi3vGGpS5hBNCSmCF9vb2VsVD7jiwjFDZRnn+li1bTE1ElVBuZ1q5xlU0gBIzdajCwhYtWlSsE6NGjeLf7927F0PQUPIQE8vR1nvyOn379jU9fTdnzhx9IWll1kKSKgKovFZPBRxhedOYU5YvX07Ij4jyCineR+Xw9BFWKhS+nwFXx+w0KDYFmgX2M8sKUeydr9a+QCCl7tkRdoefOGzYMNVBXlWO67eU8x5+s3bt2grvbioDOOiagOPN3M7h4he8Si655TeOCPLMmTPVIZEpfLrSECqyZPx3EydOdErgoDyAg67dw5dmBxXaM34q9sY/iz1ksoho6IWOlxhfLuN6QV5PX7LhlisDFa6oYLh+/bou4BpXhLW8RWjfX2zAUX93QOvIn4whZVwHVfbZ8jfh4eGGtDxXiIc2UKet9TvRXZm6RqJwB9788HIsGMFeT9+lMwYMGMADpq6Y9/QkU0BAgCpghpcHAMP6qBRv6NChfFvlysIjCWxB8RqGNnIsDTjKu2WHBw8ezK3AHeLJLamWf8m2uoAxShCi2JznDgHx+kWbNm1UAf+xsniD5bBFp1F15S7hVAG1uGSOVcXzE1FfXnZblXI3ZwJxRq12MNfLou+XfCK2aca4cePcLlwZAlru3RJf4WwjecQzYlawvucImGdmcqmywH86gdf3CaVwVgLmQFHypgoYYMXFg1ey4p1hq1ifFBBJK03AelYTcILsoBy+VgH8wBYtWljaAn1EhIO7L3jtwErA9lEk2FUB/a0kIIKxy0sJgVmNueKhW2oFXuNBAhaYXSNTmSE8hvE7xm89gNFWDSD4iuHsCbRhw4YNGzZs2LBho1T8B80nF/GnwdHTAAAAAElFTkSuQmCC";
  var piece_wP = "data:image/png;base64,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";
  var piece_wQ = "data:image/png;base64,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";
  var piece_wR = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAEEElEQVR42u1bv0sjQRhdIwloklNMLIRg4T9hKWJxZ21x1RVidea0ukoQFbEWD6OndoLFIRbW0ShaimBt4R+gIqIW+QH5bt7ejE6WJP7CnZnje/DIkt1v3pvn7sZN5vM8BoPBYDAYDAaDwWAwGAyGm0gJjgp+b8BxwZ531CuOymMboUdqvbXeGDYFS01YETx/R73OzSbjnEutt9YbQUKwIEhgNBqlWCzmv4ItLS14vyr3v7pebav98thEg7F8LWi+sd5sgO3t7bS0tEQrKyuUy+X87f7+ft28Ol4xLi+743r1ILbxHvbJMY5lTTwwlgrQ10RNg3p7A0ylUhTE5OSkHmBeHqsTgdw2qlfAPjnGrawJjpNXOtBsUm9vgF1dXVSpVB5Nl0olmpiYUMarWpD1WO3o6GgYIPa9ZAy8QhPaCvAEb84FCOTzecpkMv4+nAWNiIBmZ2f9mmq1+livtrEPxzQbAxrQgqYOZwPUg3gp6tW8dxynA3zN5Jsd+9pxXAow3uxDxBYEPkTiNgXYIXj0zM3dJh5Jz1bht/4p2NfXR0NDQzQ4OGiU8AAvgf8Cftn6LPxHGe3t7aWTkxMqFot0d3dH9/f3oRKa0IYHeNHCg8dPtn6hEBHcUiF2dnbSxcWFsXsetOFBC29LerQaEe1M9CdwdnZGNzc3dHV1FQqhBU0ZHmlnnvXhKSQFt/X7Tjwep0QiEQqhFbjnbUtPTiGhnk3T6TQtLi5SoVCg/f39DyU0oAVN7dk74TmKGUwCZ8XBwUFo9z5oQVMGOOPyt9TTKkCcGWEBWlqA0xwgB8gBcoAcIAfIAXKAHCAHyAFygBwgB8gBcoAcIAfIAXKATgVo8Btp9wPEwsa9vb3QAoSWtpjS6QCn5CSora2NkslkKISW9/Rz5pTLAT4u2x0bG6O5uTl/jd9HEhrQ0kI8djW8b4JlwerAwAA9PDyEdglDC5rev9+Fy9KLU0gLnqpL9/DwMPRlHdDUzsJT6ckJZLynVQnU3d1NCwsLH37pBglNaGv3wm3pzXpcek/LKp5bEB4GdR+XLgRIlgRXd/W+KwHS8PAw7ezs0O7urlHCA7x4tY0+9geYzWapXC4bXxcND/DiZIB6o4spwIOTAdZrtTKFQKuZVfji1fbmjnp1mv1Msk6zo96TPC7nYASfBa+92j7cojKqt5uapmy3VSwGPF/LuYSOH9IARSKRmv7e1tZWK6n3D8OzDLQk5xI6shCHkZGREVpfX/cvmeXlZZqfn/cf6m0iPMEbPMIrPMsQS3IuZgLEX3RtbY1cAzzLLnazAeJy2NjYcC5AeIZ34wF67vTHNaKxAL/+B+EpfjURIHovfgquCuYc5aqcg7E+ErROxQSjjjLmOdT+xWAwGAwGg8GwB38BOndQ3xYeBEYAAAAASUVORK5CYII=";

  // ---------------------------------------------------------------------------
  // Misc Util Functions
  // ---------------------------------------------------------------------------

  function throttle (f, interval, scope) {
    var timeout = 0
    var shouldFire = false
    var args = []

    var handleTimeout = function () {
      timeout = 0
      if (shouldFire) {
        shouldFire = false
        fire()
      }
    }

    var fire = function () {
      timeout = window.setTimeout(handleTimeout, interval)
      f.apply(scope, args)
    }

    return function (_args) {
      args = arguments
      if (!timeout) {
        fire()
      } else {
        shouldFire = true
      }
    }
  }

  // function debounce (f, interval, scope) {
  //   var timeout = 0
  //   return function (_args) {
  //     window.clearTimeout(timeout)
  //     var args = arguments
  //     timeout = window.setTimeout(function () {
  //       f.apply(scope, args)
  //     }, interval)
  //   }
  // }

  function uuid () {
    return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function (c) {
      var r = (Math.random() * 16) | 0
      return r.toString(16)
    })
  }

  function deepCopy (thing) {
    return JSON.parse(JSON.stringify(thing))
  }

  function parseSemVer (version) {
    var tmp = version.split('.')
    return {
      major: parseInt(tmp[0], 10),
      minor: parseInt(tmp[1], 10),
      patch: parseInt(tmp[2], 10)
    }
  }

  // returns true if version is >= minimum
  function validSemanticVersion (version, minimum) {
    version = parseSemVer(version)
    minimum = parseSemVer(minimum)

    var versionNum = (version.major * 100000 * 100000) +
                     (version.minor * 100000) +
                     version.patch
    var minimumNum = (minimum.major * 100000 * 100000) +
                     (minimum.minor * 100000) +
                     minimum.patch

    return versionNum >= minimumNum
  }

  function interpolateTemplate (str, obj) {
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue
      var keyTemplateStr = '{' + key + '}'
      var value = obj[key]
      while (str.indexOf(keyTemplateStr) !== -1) {
        str = str.replace(keyTemplateStr, value)
      }
    }
    return str
  }

  if (RUN_ASSERTS) {
    console.assert(interpolateTemplate('abc', {a: 'x'}) === 'abc')
    console.assert(interpolateTemplate('{a}bc', {}) === '{a}bc')
    console.assert(interpolateTemplate('{a}bc', {p: 'q'}) === '{a}bc')
    console.assert(interpolateTemplate('{a}bc', {a: 'x'}) === 'xbc')
    console.assert(interpolateTemplate('{a}bc{a}bc', {a: 'x'}) === 'xbcxbc')
    console.assert(interpolateTemplate('{a}{a}{b}', {a: 'x', b: 'y'}) === 'xxy')
  }

  // ---------------------------------------------------------------------------
  // Predicates
  // ---------------------------------------------------------------------------

  function isString (s) {
    return typeof s === 'string'
  }

  function isFunction (f) {
    return typeof f === 'function'
  }

  function isInteger (n) {
    return typeof n === 'number' &&
           isFinite(n) &&
           Math.floor(n) === n
  }

  function validAnimationSpeed (speed) {
    if (speed === 'fast' || speed === 'slow') return true
    if (!isInteger(speed)) return false
    return speed >= 0
  }

  function validThrottleRate (rate) {
    return isInteger(rate) &&
           rate >= 1
  }

  function validMove (move) {
    // move should be a string
    if (!isString(move)) return false

    // move should be in the form of "e2-e4", "f6-d5"
    var squares = move.split('-')
    if (squares.length !== 2) return false

    return validSquare(squares[0]) && validSquare(squares[1])
  }

  function validSquare (square) {
    return isString(square) && square.search(/^[a-h][1-8]$/) !== -1
  }

  if (RUN_ASSERTS) {
    console.assert(validSquare('a1'))
    console.assert(validSquare('e2'))
    console.assert(!validSquare('D2'))
    console.assert(!validSquare('g9'))
    console.assert(!validSquare('a'))
    console.assert(!validSquare(true))
    console.assert(!validSquare(null))
    console.assert(!validSquare({}))
  }

  function validPieceCode (code) {
    return isString(code) && code.search(/^[bw][KQRNBP]$/) !== -1
  }

  if (RUN_ASSERTS) {
    console.assert(validPieceCode('bP'))
    console.assert(validPieceCode('bK'))
    console.assert(validPieceCode('wK'))
    console.assert(validPieceCode('wR'))
    console.assert(!validPieceCode('WR'))
    console.assert(!validPieceCode('Wr'))
    console.assert(!validPieceCode('a'))
    console.assert(!validPieceCode(true))
    console.assert(!validPieceCode(null))
    console.assert(!validPieceCode({}))
  }

  function validFen (fen) {
    if (!isString(fen)) return false

    // cut off any move, castling, etc info from the end
    // we're only interested in position information
    fen = fen.replace(/ .+$/, '')

    // expand the empty square numbers to just 1s
    fen = expandFenEmptySquares(fen)

    // FEN should be 8 sections separated by slashes
    var chunks = fen.split('/')
    if (chunks.length !== 8) return false

    // check each section
    for (var i = 0; i < 8; i++) {
      if (chunks[i].length !== 8 ||
          chunks[i].search(/[^kqrnbpKQRNBP1]/) !== -1) {
        return false
      }
    }

    return true
  }

  if (RUN_ASSERTS) {
    console.assert(validFen(START_FEN))
    console.assert(validFen('8/8/8/8/8/8/8/8'))
    console.assert(validFen('r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R'))
    console.assert(validFen('3r3r/1p4pp/2nb1k2/pP3p2/8/PB2PN2/p4PPP/R4RK1 b - - 0 1'))
    console.assert(!validFen('3r3z/1p4pp/2nb1k2/pP3p2/8/PB2PN2/p4PPP/R4RK1 b - - 0 1'))
    console.assert(!validFen('anbqkbnr/8/8/8/8/8/PPPPPPPP/8'))
    console.assert(!validFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/'))
    console.assert(!validFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBN'))
    console.assert(!validFen('888888/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'))
    console.assert(!validFen('888888/pppppppp/74/8/8/8/PPPPPPPP/RNBQKBNR'))
    console.assert(!validFen({}))
  }

  function validPositionObject (pos) {
    if (!$.isPlainObject(pos)) return false

    for (var i in pos) {
      if (!pos.hasOwnProperty(i)) continue

      if (!validSquare(i) || !validPieceCode(pos[i])) {
        return false
      }
    }

    return true
  }

  if (RUN_ASSERTS) {
    console.assert(validPositionObject(START_POSITION))
    console.assert(validPositionObject({}))
    console.assert(validPositionObject({e2: 'wP'}))
    console.assert(validPositionObject({e2: 'wP', d2: 'wP'}))
    console.assert(!validPositionObject({e2: 'BP'}))
    console.assert(!validPositionObject({y2: 'wP'}))
    console.assert(!validPositionObject(null))
    console.assert(!validPositionObject('start'))
    console.assert(!validPositionObject(START_FEN))
  }

  function isTouchDevice () {
    return 'ontouchstart' in document.documentElement
  }

  function validJQueryVersion () {
    return typeof window.$ &&
           $.fn &&
           $.fn.jquery &&
           validSemanticVersion($.fn.jquery, MINIMUM_JQUERY_VERSION)
  }

  // ---------------------------------------------------------------------------
  // Chess Util Functions
  // ---------------------------------------------------------------------------

  // convert FEN piece code to bP, wK, etc
  function fenToPieceCode (piece) {
    // black piece
    if (piece.toLowerCase() === piece) {
      return 'b' + piece.toUpperCase()
    }

    // white piece
    return 'w' + piece.toUpperCase()
  }

  // convert bP, wK, etc code to FEN structure
  function pieceCodeToFen (piece) {
    var pieceCodeLetters = piece.split('')

    // white piece
    if (pieceCodeLetters[0] === 'w') {
      return pieceCodeLetters[1].toUpperCase()
    }

    // black piece
    return pieceCodeLetters[1].toLowerCase()
  }

  // convert FEN string to position object
  // returns false if the FEN string is invalid
  function fenToObj (fen) {
    if (!validFen(fen)) return false

    // cut off any move, castling, etc info from the end
    // we're only interested in position information
    fen = fen.replace(/ .+$/, '')

    var rows = fen.split('/')
    var position = {}

    var currentRow = 8
    for (var i = 0; i < 8; i++) {
      var row = rows[i].split('')
      var colIdx = 0

      // loop through each character in the FEN section
      for (var j = 0; j < row.length; j++) {
        // number / empty squares
        if (row[j].search(/[1-8]/) !== -1) {
          var numEmptySquares = parseInt(row[j], 10)
          colIdx = colIdx + numEmptySquares
        } else {
          // piece
          var square = COLUMNS[colIdx] + currentRow
          position[square] = fenToPieceCode(row[j])
          colIdx = colIdx + 1
        }
      }

      currentRow = currentRow - 1
    }

    return position
  }

  // position object to FEN string
  // returns false if the obj is not a valid position object
  function objToFen (obj) {
    if (!validPositionObject(obj)) return false

    var fen = ''

    var currentRow = 8
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var square = COLUMNS[j] + currentRow

        // piece exists
        if (obj.hasOwnProperty(square)) {
          fen = fen + pieceCodeToFen(obj[square])
        } else {
          // empty space
          fen = fen + '1'
        }
      }

      if (i !== 7) {
        fen = fen + '/'
      }

      currentRow = currentRow - 1
    }

    // squeeze the empty numbers together
    fen = squeezeFenEmptySquares(fen)

    return fen
  }

  if (RUN_ASSERTS) {
    console.assert(objToFen(START_POSITION) === START_FEN)
    console.assert(objToFen({}) === '8/8/8/8/8/8/8/8')
    console.assert(objToFen({a2: 'wP', 'b2': 'bP'}) === '8/8/8/8/8/8/Pp6/8')
  }

  function squeezeFenEmptySquares (fen) {
    return fen.replace(/11111111/g, '8')
      .replace(/1111111/g, '7')
      .replace(/111111/g, '6')
      .replace(/11111/g, '5')
      .replace(/1111/g, '4')
      .replace(/111/g, '3')
      .replace(/11/g, '2')
  }

  function expandFenEmptySquares (fen) {
    return fen.replace(/8/g, '11111111')
      .replace(/7/g, '1111111')
      .replace(/6/g, '111111')
      .replace(/5/g, '11111')
      .replace(/4/g, '1111')
      .replace(/3/g, '111')
      .replace(/2/g, '11')
  }

  // returns the distance between two squares
  function squareDistance (squareA, squareB) {
    var squareAArray = squareA.split('')
    var squareAx = COLUMNS.indexOf(squareAArray[0]) + 1
    var squareAy = parseInt(squareAArray[1], 10)

    var squareBArray = squareB.split('')
    var squareBx = COLUMNS.indexOf(squareBArray[0]) + 1
    var squareBy = parseInt(squareBArray[1], 10)

    var xDelta = Math.abs(squareAx - squareBx)
    var yDelta = Math.abs(squareAy - squareBy)

    if (xDelta >= yDelta) return xDelta
    return yDelta
  }

  // returns the square of the closest instance of piece
  // returns false if no instance of piece is found in position
  function findClosestPiece (position, piece, square) {
    // create array of closest squares from square
    var closestSquares = createRadius(square)

    // search through the position in order of distance for the piece
    for (var i = 0; i < closestSquares.length; i++) {
      var s = closestSquares[i]

      if (position.hasOwnProperty(s) && position[s] === piece) {
        return s
      }
    }

    return false
  }

  // returns an array of closest squares from square
  function createRadius (square) {
    var squares = []

    // calculate distance of all squares
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        var s = COLUMNS[i] + (j + 1)

        // skip the square we're starting from
        if (square === s) continue

        squares.push({
          square: s,
          distance: squareDistance(square, s)
        })
      }
    }

    // sort by distance
    squares.sort(function (a, b) {
      return a.distance - b.distance
    })

    // just return the square code
    var surroundingSquares = []
    for (i = 0; i < squares.length; i++) {
      surroundingSquares.push(squares[i].square)
    }

    return surroundingSquares
  }

  // given a position and a set of moves, return a new position
  // with the moves executed
  function calculatePositionFromMoves (position, moves) {
    var newPosition = deepCopy(position)

    for (var i in moves) {
      if (!moves.hasOwnProperty(i)) continue

      // skip the move if the position doesn't have a piece on the source square
      if (!newPosition.hasOwnProperty(i)) continue

      var piece = newPosition[i]
      delete newPosition[i]
      newPosition[moves[i]] = piece
    }

    return newPosition
  }

  // TODO: add some asserts here for calculatePositionFromMoves

  // ---------------------------------------------------------------------------
  // HTML
  // ---------------------------------------------------------------------------

  function buildContainerHTML (hasSparePieces) {
    var html = '<div class="{chessboard}">'

    if (hasSparePieces) {
      html += '<div class="{sparePieces} {sparePiecesTop}"></div>'
    }

    html += '<div class="{board}"></div>'

    if (hasSparePieces) {
      html += '<div class="{sparePieces} {sparePiecesBottom}"></div>'
    }

    html += '</div>'

    return interpolateTemplate(html, CSS)
  }

  // ---------------------------------------------------------------------------
  // Config
  // ---------------------------------------------------------------------------

  function expandConfigArgumentShorthand (config) {
    if (config === 'start') {
      config = {position: deepCopy(START_POSITION)}
    } else if (validFen(config)) {
      config = {position: fenToObj(config)}
    } else if (validPositionObject(config)) {
      config = {position: deepCopy(config)}
    }

    // config must be an object
    if (!$.isPlainObject(config)) config = {}

    return config
  }

  // validate config / set default options
  function expandConfig (config) {
    // default for orientation is white
    if (config.orientation !== 'black') config.orientation = 'white'

    // default for showNotation is true
    if (config.showNotation !== false) config.showNotation = true

    // default for draggable is false
    if (config.draggable !== true) config.draggable = false

    // default for dropOffBoard is 'snapback'
    if (config.dropOffBoard !== 'trash') config.dropOffBoard = 'snapback'

    // default for sparePieces is false
    if (config.sparePieces !== true) config.sparePieces = false

    // draggable must be true if sparePieces is enabled
    if (config.sparePieces) config.draggable = true

    // default piece theme is wikipedia
    if (!config.hasOwnProperty('pieceTheme') ||
        (!isString(config.pieceTheme) && !isFunction(config.pieceTheme))) {
      config.pieceTheme = '{piece}.png'
    }

    // animation speeds
    if (!validAnimationSpeed(config.appearSpeed)) config.appearSpeed = DEFAULT_APPEAR_SPEED
    if (!validAnimationSpeed(config.moveSpeed)) config.moveSpeed = DEFAULT_MOVE_SPEED
    if (!validAnimationSpeed(config.snapbackSpeed)) config.snapbackSpeed = DEFAULT_SNAPBACK_SPEED
    if (!validAnimationSpeed(config.snapSpeed)) config.snapSpeed = DEFAULT_SNAP_SPEED
    if (!validAnimationSpeed(config.trashSpeed)) config.trashSpeed = DEFAULT_TRASH_SPEED

    // throttle rate
    if (!validThrottleRate(config.dragThrottleRate)) config.dragThrottleRate = DEFAULT_DRAG_THROTTLE_RATE

    return config
  }

  // ---------------------------------------------------------------------------
  // Dependencies
  // ---------------------------------------------------------------------------

  // check for a compatible version of jQuery
  function checkJQuery () {
    if (!validJQueryVersion()) {
      var errorMsg = 'Chessboard Error 1005: Unable to find a valid version of jQuery. ' +
        'Please include jQuery ' + MINIMUM_JQUERY_VERSION + ' or higher on the page' +
        '\n\n' +
        'Exiting' + ELLIPSIS
      window.alert(errorMsg)
      return false
    }

    return true
  }

  // return either boolean false or the $container element
  function checkContainerArg (containerElOrString) {
    if (containerElOrString === '') {
      var errorMsg1 = 'Chessboard Error 1001: ' +
        'The first argument to Chessboard() cannot be an empty string.' +
        '\n\n' +
        'Exiting' + ELLIPSIS
      window.alert(errorMsg1)
      return false
    }

    // convert containerEl to query selector if it is a string
    if (isString(containerElOrString) &&
        containerElOrString.charAt(0) !== '#') {
      containerElOrString = '#' + containerElOrString
    }

    // containerEl must be something that becomes a jQuery collection of size 1
    var $container = $(containerElOrString)
    if ($container.length !== 1) {
      var errorMsg2 = 'Chessboard Error 1003: ' +
        'The first argument to Chessboard() must be the ID of a DOM node, ' +
        'an ID query selector, or a single DOM node.' +
        '\n\n' +
        'Exiting' + ELLIPSIS
      window.alert(errorMsg2)
      return false
    }

    return $container
  }

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  function constructor (containerElOrString, config) {
    // first things first: check basic dependencies
    if (!checkJQuery()) return null
    var $container = checkContainerArg(containerElOrString)
    if (!$container) return null

    // ensure the config object is what we expect
    config = expandConfigArgumentShorthand(config)
    config = expandConfig(config)

    // DOM elements
    var $board = null
    var $draggedPiece = null
    var $sparePiecesTop = null
    var $sparePiecesBottom = null

    // constructor return object
    var widget = {}

    // -------------------------------------------------------------------------
    // Stateful
    // -------------------------------------------------------------------------

    var boardBorderSize = 2
    var currentOrientation = 'white'
    var currentPosition = {}
    var draggedPiece = null
    var draggedPieceLocation = null
    var draggedPieceSource = null
    var isDragging = false
    var sparePiecesElsIds = {}
    var squareElsIds = {}
    var squareElsOffsets = {}
    var squareSize = 16

    // -------------------------------------------------------------------------
    // Validation / Errors
    // -------------------------------------------------------------------------

    function error (code, msg, obj) {
      // do nothing if showErrors is not set
      if (
        config.hasOwnProperty('showErrors') !== true ||
          config.showErrors === false
      ) {
        return
      }

      var errorText = 'Chessboard Error ' + code + ': ' + msg

      // print to console
      if (
        config.showErrors === 'console' &&
          typeof console === 'object' &&
          typeof console.log === 'function'
      ) {
        console.log(errorText)
        if (arguments.length >= 2) {
          console.log(obj)
        }
        return
      }

      // alert errors
      if (config.showErrors === 'alert') {
        if (obj) {
          errorText += '\n\n' + JSON.stringify(obj)
        }
        window.alert(errorText)
        return
      }

      // custom function
      if (isFunction(config.showErrors)) {
        config.showErrors(code, msg, obj)
      }
    }

    function setInitialState () {
      currentOrientation = config.orientation

      // make sure position is valid
      if (config.hasOwnProperty('position')) {
        if (config.position === 'start') {
          currentPosition = deepCopy(START_POSITION)
        } else if (validFen(config.position)) {
          currentPosition = fenToObj(config.position)
        } else if (validPositionObject(config.position)) {
          currentPosition = deepCopy(config.position)
        } else {
          error(
            7263,
            'Invalid value passed to config.position.',
            config.position
          )
        }
      }
    }

    // -------------------------------------------------------------------------
    // DOM Misc
    // -------------------------------------------------------------------------

    // calculates square size based on the width of the container
    // got a little CSS black magic here, so let me explain:
    // get the width of the container element (could be anything), reduce by 1 for
    // fudge factor, and then keep reducing until we find an exact mod 8 for
    // our square size
    function calculateSquareSize () {
      var containerWidth = parseInt($container.width(), 10)

      // defensive, prevent infinite loop
      if (!containerWidth || containerWidth <= 0) {
        return 0
      }

      // pad one pixel
      var boardWidth = containerWidth - 1

      while (boardWidth % 8 !== 0 && boardWidth > 0) {
        boardWidth = boardWidth - 1
      }

      return boardWidth / 8
    }

    // create random IDs for elements
    function createElIds () {
      // squares on the board
      for (var i = 0; i < COLUMNS.length; i++) {
        for (var j = 1; j <= 8; j++) {
          var square = COLUMNS[i] + j
          squareElsIds[square] = square + '-' + uuid()
        }
      }

      // spare pieces
      var pieces = 'KQRNBP'.split('')
      for (i = 0; i < pieces.length; i++) {
        var whitePiece = 'w' + pieces[i]
        var blackPiece = 'b' + pieces[i]
        sparePiecesElsIds[whitePiece] = whitePiece + '-' + uuid()
        sparePiecesElsIds[blackPiece] = blackPiece + '-' + uuid()
      }
    }

    // -------------------------------------------------------------------------
    // Markup Building
    // -------------------------------------------------------------------------

    function buildBoardHTML (orientation) {
      if (orientation !== 'black') {
        orientation = 'white'
      }

      var html = ''

      // algebraic notation / orientation
      var alpha = deepCopy(COLUMNS)
      var row = 8
      if (orientation === 'black') {
        alpha.reverse()
        row = 1
      }

      var squareColor = 'white'
      for (var i = 0; i < 8; i++) {
        html += '<div class="{row}">'
        for (var j = 0; j < 8; j++) {
          var square = alpha[j] + row

          html += '<div class="{square} ' + CSS[squareColor] + ' ' +
            'square-' + square + '" ' +
            'style="width:' + squareSize + 'px;height:' + squareSize + 'px;" ' +
            'id="' + squareElsIds[square] + '" ' +
            'data-square="' + square + '">'

          if (config.showNotation) {
            // alpha notation
            if ((orientation === 'white' && row === 1) ||
                (orientation === 'black' && row === 8)) {
              html += '<div class="{notation} {alpha}">' + alpha[j] + '</div>'
            }

            // numeric notation
            if (j === 0) {
              html += '<div class="{notation} {numeric}">' + row + '</div>'
            }
          }

          html += '</div>' // end .square

          squareColor = (squareColor === 'white') ? 'black' : 'white'
        }
        html += '<div class="{clearfix}"></div></div>'

        squareColor = (squareColor === 'white') ? 'black' : 'white'

        if (orientation === 'white') {
          row = row - 1
        } else {
          row = row + 1
        }
      }

      return interpolateTemplate(html, CSS)
    }

    function buildPieceImgSrc (piece) {
      var myFinalPiece;
      if (piece=="bB"){myFinalPiece=piece_bB}
      else if (piece=="bK"){myFinalPiece=piece_bK}
      else if (piece=="bN"){myFinalPiece=piece_bN}
      else if (piece=="bP"){myFinalPiece=piece_bP}
      else if (piece=="bQ"){myFinalPiece=piece_bQ}
      else if (piece=="bR"){myFinalPiece=piece_bR}
      else if (piece=="wB"){myFinalPiece=piece_wB}
      else if (piece=="wK"){myFinalPiece=piece_wK}
      else if (piece=="wN"){myFinalPiece=piece_wN}
      else if (piece=="wP"){myFinalPiece=piece_wP}
      else if (piece=="wQ"){myFinalPiece=piece_wQ}
      else if (piece=="wR"){myFinalPiece=piece_wR}
      return myFinalPiece;
    }

    function buildPieceHTML (piece, hidden, id) {
      var myFinalPiece;
      if (piece=="bB"){myFinalPiece=piece_bB}
      else if (piece=="bK"){myFinalPiece=piece_bK}
      else if (piece=="bN"){myFinalPiece=piece_bN}
      else if (piece=="bP"){myFinalPiece=piece_bP}
      else if (piece=="bQ"){myFinalPiece=piece_bQ}
      else if (piece=="bR"){myFinalPiece=piece_bR}
      else if (piece=="wB"){myFinalPiece=piece_wB}
      else if (piece=="wK"){myFinalPiece=piece_wK}
      else if (piece=="wN"){myFinalPiece=piece_wN}
      else if (piece=="wP"){myFinalPiece=piece_wP}
      else if (piece=="wQ"){myFinalPiece=piece_wQ}
      else if (piece=="wR"){myFinalPiece=piece_wR}

      var html = '<img src="' + myFinalPiece + '"'
      if (isString(id) && id !== '') {
        html += 'id="' + id + '" '
      }
      html += 'alt="" ' +
        'class="{piece}" ' +
        'data-piece="' + piece + '" ' +
        'style="width:' + squareSize + 'px;' + 'height:' + squareSize + 'px;'

      if (hidden) {
        html += 'display:none;'
      }

      html += '" />'

      return interpolateTemplate(html, CSS)
    }

    function buildSparePiecesHTML (color) {
      var pieces = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP']
      if (color === 'black') {
        pieces = ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP']
      }

      var html = ''
      for (var i = 0; i < pieces.length; i++) {
        html += buildPieceHTML(pieces[i], false, sparePiecesElsIds[pieces[i]])
      }

      return html
    }

    // -------------------------------------------------------------------------
    // Animations
    // -------------------------------------------------------------------------

    function animateSquareToSquare (src, dest, piece, completeFn) {
      // get information about the source and destination squares
      var $srcSquare = $('#' + squareElsIds[src])
      var srcSquarePosition = $srcSquare.offset()
      var $destSquare = $('#' + squareElsIds[dest])
      var destSquarePosition = $destSquare.offset()

      // create the animated piece and absolutely position it
      // over the source square
      var animatedPieceId = uuid()
      $('body').append(buildPieceHTML(piece, true, animatedPieceId))
      var $animatedPiece = $('#' + animatedPieceId)
      $animatedPiece.css({
        display: '',
        position: 'absolute',
        top: srcSquarePosition.top,
        left: srcSquarePosition.left
      })

      // remove original piece from source square
      $srcSquare.find('.' + CSS.piece).remove()

      function onFinishAnimation1 () {
        // add the "real" piece to the destination square
        $destSquare.append(buildPieceHTML(piece))

        // remove the animated piece
        $animatedPiece.remove()

        // run complete function
        if (isFunction(completeFn)) {
          completeFn()
        }
      }

      // animate the piece to the destination square
      var opts = {
        duration: config.moveSpeed,
        complete: onFinishAnimation1
      }
      $animatedPiece.animate(destSquarePosition, opts)
    }

    function animateSparePieceToSquare (piece, dest, completeFn) {
      var srcOffset = $('#' + sparePiecesElsIds[piece]).offset()
      var $destSquare = $('#' + squareElsIds[dest])
      var destOffset = $destSquare.offset()

      // create the animate piece
      var pieceId = uuid()
      $('body').append(buildPieceHTML(piece, true, pieceId))
      var $animatedPiece = $('#' + pieceId)
      $animatedPiece.css({
        display: '',
        position: 'absolute',
        left: srcOffset.left,
        top: srcOffset.top
      })

      // on complete
      function onFinishAnimation2 () {
        // add the "real" piece to the destination square
        $destSquare.find('.' + CSS.piece).remove()
        $destSquare.append(buildPieceHTML(piece))

        // remove the animated piece
        $animatedPiece.remove()

        // run complete function
        if (isFunction(completeFn)) {
          completeFn()
        }
      }

      // animate the piece to the destination square
      var opts = {
        duration: config.moveSpeed,
        complete: onFinishAnimation2
      }
      $animatedPiece.animate(destOffset, opts)
    }

    // execute an array of animations
    function doAnimations (animations, oldPos, newPos) {
      if (animations.length === 0) return

      var numFinished = 0
      function onFinishAnimation3 () {
        // exit if all the animations aren't finished
        numFinished = numFinished + 1
        if (numFinished !== animations.length) return

        drawPositionInstant()

        // run their onMoveEnd function
        if (isFunction(config.onMoveEnd)) {
          config.onMoveEnd(deepCopy(oldPos), deepCopy(newPos))
        }
      }

      for (var i = 0; i < animations.length; i++) {
        var animation = animations[i]

        // clear a piece
        if (animation.type === 'clear') {
          $('#' + squareElsIds[animation.square] + ' .' + CSS.piece)
            .fadeOut(config.trashSpeed, onFinishAnimation3)

        // add a piece with no spare pieces - fade the piece onto the square
        } else if (animation.type === 'add' && !config.sparePieces) {
          $('#' + squareElsIds[animation.square])
            .append(buildPieceHTML(animation.piece, true))
            .find('.' + CSS.piece)
            .fadeIn(config.appearSpeed, onFinishAnimation3)

        // add a piece with spare pieces - animate from the spares
        } else if (animation.type === 'add' && config.sparePieces) {
          animateSparePieceToSquare(animation.piece, animation.square, onFinishAnimation3)

        // move a piece from squareA to squareB
        } else if (animation.type === 'move') {
          animateSquareToSquare(animation.source, animation.destination, animation.piece, onFinishAnimation3)
        }
      }
    }

    // calculate an array of animations that need to happen in order to get
    // from pos1 to pos2
    function calculateAnimations (pos1, pos2) {
      // make copies of both
      pos1 = deepCopy(pos1)
      pos2 = deepCopy(pos2)

      var animations = []
      var squaresMovedTo = {}

      // remove pieces that are the same in both positions
      for (var i in pos2) {
        if (!pos2.hasOwnProperty(i)) continue

        if (pos1.hasOwnProperty(i) && pos1[i] === pos2[i]) {
          delete pos1[i]
          delete pos2[i]
        }
      }

      // find all the "move" animations
      for (i in pos2) {
        if (!pos2.hasOwnProperty(i)) continue

        var closestPiece = findClosestPiece(pos1, pos2[i], i)
        if (closestPiece) {
          animations.push({
            type: 'move',
            source: closestPiece,
            destination: i,
            piece: pos2[i]
          })

          delete pos1[closestPiece]
          delete pos2[i]
          squaresMovedTo[i] = true
        }
      }

      // "add" animations
      for (i in pos2) {
        if (!pos2.hasOwnProperty(i)) continue

        animations.push({
          type: 'add',
          square: i,
          piece: pos2[i]
        })

        delete pos2[i]
      }

      // "clear" animations
      for (i in pos1) {
        if (!pos1.hasOwnProperty(i)) continue

        // do not clear a piece if it is on a square that is the result
        // of a "move", ie: a piece capture
        if (squaresMovedTo.hasOwnProperty(i)) continue

        animations.push({
          type: 'clear',
          square: i,
          piece: pos1[i]
        })

        delete pos1[i]
      }

      return animations
    }

    // -------------------------------------------------------------------------
    // Control Flow
    // -------------------------------------------------------------------------

    function drawPositionInstant () {
      // clear the board
      $board.find('.' + CSS.piece).remove()

      // add the pieces
      for (var i in currentPosition) {
        if (!currentPosition.hasOwnProperty(i)) continue

        $('#' + squareElsIds[i]).append(buildPieceHTML(currentPosition[i]))
      }
    }

    function drawBoard () {
      $board.html(buildBoardHTML(currentOrientation, squareSize, config.showNotation))
      drawPositionInstant()

      if (config.sparePieces) {
        if (currentOrientation === 'white') {
          $sparePiecesTop.html(buildSparePiecesHTML('black'))
          $sparePiecesBottom.html(buildSparePiecesHTML('white'))
        } else {
          $sparePiecesTop.html(buildSparePiecesHTML('white'))
          $sparePiecesBottom.html(buildSparePiecesHTML('black'))
        }
      }
    }

    function setCurrentPosition (position) {
      var oldPos = deepCopy(currentPosition)
      var newPos = deepCopy(position)
      var oldFen = objToFen(oldPos)
      var newFen = objToFen(newPos)

      // do nothing if no change in position
      if (oldFen === newFen) return

      // run their onChange function
      if (isFunction(config.onChange)) {
        config.onChange(oldPos, newPos)
      }

      // update state
      currentPosition = position
    }

    function isXYOnSquare (x, y) {
      for (var i in squareElsOffsets) {
        if (!squareElsOffsets.hasOwnProperty(i)) continue

        var s = squareElsOffsets[i]
        if (x >= s.left &&
            x < s.left + squareSize &&
            y >= s.top &&
            y < s.top + squareSize) {
          return i
        }
      }

      return 'offboard'
    }

    // records the XY coords of every square into memory
    function captureSquareOffsets () {
      squareElsOffsets = {}

      for (var i in squareElsIds) {
        if (!squareElsIds.hasOwnProperty(i)) continue

        squareElsOffsets[i] = $('#' + squareElsIds[i]).offset()
      }
    }

    function removeSquareHighlights () {
      $board
        .find('.' + CSS.square)
        .removeClass(CSS.highlight1 + ' ' + CSS.highlight2)
    }

    function snapbackDraggedPiece () {
      // there is no "snapback" for spare pieces
      if (draggedPieceSource === 'spare') {
        trashDraggedPiece()
        return
      }

      removeSquareHighlights()

      // animation complete
      function complete () {
        drawPositionInstant()
        $draggedPiece.css('display', 'none')

        // run their onSnapbackEnd function
        if (isFunction(config.onSnapbackEnd)) {
          config.onSnapbackEnd(
            draggedPiece,
            draggedPieceSource,
            deepCopy(currentPosition),
            currentOrientation
          )
        }
      }

      // get source square position
      var sourceSquarePosition = $('#' + squareElsIds[draggedPieceSource]).offset()

      // animate the piece to the target square
      var opts = {
        duration: config.snapbackSpeed,
        complete: complete
      }
      $draggedPiece.animate(sourceSquarePosition, opts)

      // set state
      isDragging = false
    }

    function trashDraggedPiece () {
      removeSquareHighlights()

      // remove the source piece
      var newPosition = deepCopy(currentPosition)
      delete newPosition[draggedPieceSource]
      setCurrentPosition(newPosition)

      // redraw the position
      drawPositionInstant()

      // hide the dragged piece
      $draggedPiece.fadeOut(config.trashSpeed)

      // set state
      isDragging = false
    }

    function dropDraggedPieceOnSquare (square) {
      removeSquareHighlights()

      // update position
      var newPosition = deepCopy(currentPosition)
      delete newPosition[draggedPieceSource]
      newPosition[square] = draggedPiece
      setCurrentPosition(newPosition)

      // get target square information
      var targetSquarePosition = $('#' + squareElsIds[square]).offset()

      // animation complete
      function onAnimationComplete () {
        drawPositionInstant()
        $draggedPiece.css('display', 'none')

        // execute their onSnapEnd function
        if (isFunction(config.onSnapEnd)) {
          config.onSnapEnd(draggedPieceSource, square, draggedPiece)
        }
      }

      // snap the piece to the target square
      var opts = {
        duration: config.snapSpeed,
        complete: onAnimationComplete
      }
      $draggedPiece.animate(targetSquarePosition, opts)

      // set state
      isDragging = false
    }

    function beginDraggingPiece (source, piece, x, y) {
      // run their custom onDragStart function
      // their custom onDragStart function can cancel drag start
      if (isFunction(config.onDragStart) &&
          config.onDragStart(source, piece, deepCopy(currentPosition), currentOrientation) === false) {
        return
      }

      // set state
      isDragging = true
      draggedPiece = piece
      draggedPieceSource = source

      // if the piece came from spare pieces, location is offboard
      if (source === 'spare') {
        draggedPieceLocation = 'offboard'
      } else {
        draggedPieceLocation = source
      }

      // capture the x, y coords of all squares in memory
      captureSquareOffsets()

      // create the dragged piece
      $draggedPiece.attr('src', buildPieceImgSrc(piece)).css({
        display: '',
        position: 'absolute',
        left: x - squareSize / 2,
        top: y - squareSize / 2
      })

      if (source !== 'spare') {
        // highlight the source square and hide the piece
        $('#' + squareElsIds[source])
          .addClass(CSS.highlight1)
          .find('.' + CSS.piece)
          .css('display', 'none')
      }
    }

    function updateDraggedPiece (x, y) {
      // put the dragged piece over the mouse cursor
      $draggedPiece.css({
        left: x - squareSize / 2,
        top: y - squareSize / 2
      })

      // get location
      var location = isXYOnSquare(x, y)

      // do nothing if the location has not changed
      if (location === draggedPieceLocation) return

      // remove highlight from previous square
      if (validSquare(draggedPieceLocation)) {
        $('#' + squareElsIds[draggedPieceLocation]).removeClass(CSS.highlight2)
      }

      // add highlight to new square
      if (validSquare(location)) {
        $('#' + squareElsIds[location]).addClass(CSS.highlight2)
      }

      // run onDragMove
      if (isFunction(config.onDragMove)) {
        config.onDragMove(
          location,
          draggedPieceLocation,
          draggedPieceSource,
          draggedPiece,
          deepCopy(currentPosition),
          currentOrientation
        )
      }

      // update state
      draggedPieceLocation = location
    }

    function stopDraggedPiece (location) {
      // determine what the action should be
      var action = 'drop'
      if (location === 'offboard' && config.dropOffBoard === 'snapback') {
        action = 'snapback'
      }
      if (location === 'offboard' && config.dropOffBoard === 'trash') {
        action = 'trash'
      }

      // run their onDrop function, which can potentially change the drop action
      if (isFunction(config.onDrop)) {
        var newPosition = deepCopy(currentPosition)

        // source piece is a spare piece and position is off the board
        // if (draggedPieceSource === 'spare' && location === 'offboard') {...}
        // position has not changed; do nothing

        // source piece is a spare piece and position is on the board
        if (draggedPieceSource === 'spare' && validSquare(location)) {
          // add the piece to the board
          newPosition[location] = draggedPiece
        }

        // source piece was on the board and position is off the board
        if (validSquare(draggedPieceSource) && location === 'offboard') {
          // remove the piece from the board
          delete newPosition[draggedPieceSource]
        }

        // source piece was on the board and position is on the board
        if (validSquare(draggedPieceSource) && validSquare(location)) {
          // move the piece
          delete newPosition[draggedPieceSource]
          newPosition[location] = draggedPiece
        }

        var oldPosition = deepCopy(currentPosition)

        var result = config.onDrop(
          draggedPieceSource,
          location,
          draggedPiece,
          newPosition,
          oldPosition,
          currentOrientation
        )
        if (result === 'snapback' || result === 'trash') {
          action = result
        }
      }

      // do it!
      if (action === 'snapback') {
        snapbackDraggedPiece()
      } else if (action === 'trash') {
        trashDraggedPiece()
      } else if (action === 'drop') {
        dropDraggedPieceOnSquare(location)
      }
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    // clear the board
    widget.clear = function (useAnimation) {
      widget.position({}, useAnimation)
    }

    // remove the widget from the page
    widget.destroy = function () {
      // remove markup
      $container.html('')
      $draggedPiece.remove()

      // remove event handlers
      $container.unbind()
    }

    // shorthand method to get the current FEN
    widget.fen = function () {
      return widget.position('fen')
    }

    // flip orientation
    widget.flip = function () {
      return widget.orientation('flip')
    }

    // move pieces
    // TODO: this method should be variadic as well as accept an array of moves
    widget.move = function () {
      // no need to throw an error here; just do nothing
      // TODO: this should return the current position
      if (arguments.length === 0) return

      var useAnimation = true

      // collect the moves into an object
      var moves = {}
      for (var i = 0; i < arguments.length; i++) {
        // any "false" to this function means no animations
        if (arguments[i] === false) {
          useAnimation = false
          continue
        }

        // skip invalid arguments
        if (!validMove(arguments[i])) {
          error(2826, 'Invalid move passed to the move method.', arguments[i])
          continue
        }

        var tmp = arguments[i].split('-')
        moves[tmp[0]] = tmp[1]
      }

      // calculate position from moves
      var newPos = calculatePositionFromMoves(currentPosition, moves)

      // update the board
      widget.position(newPos, useAnimation)

      // return the new position object
      return newPos
    }

    widget.orientation = function (arg) {
      // no arguments, return the current orientation
      if (arguments.length === 0) {
        return currentOrientation
      }

      // set to white or black
      if (arg === 'white' || arg === 'black') {
        currentOrientation = arg
        drawBoard()
        return currentOrientation
      }

      // flip orientation
      if (arg === 'flip') {
        currentOrientation = currentOrientation === 'white' ? 'black' : 'white'
        drawBoard()
        return currentOrientation
      }

      error(5482, 'Invalid value passed to the orientation method.', arg)
    }

    widget.position = function (position, useAnimation) {
      // no arguments, return the current position
      if (arguments.length === 0) {
        return deepCopy(currentPosition)
      }

      // get position as FEN
      if (isString(position) && position.toLowerCase() === 'fen') {
        return objToFen(currentPosition)
      }

      // start position
      if (isString(position) && position.toLowerCase() === 'start') {
        position = deepCopy(START_POSITION)
      }

      // convert FEN to position object
      if (validFen(position)) {
        position = fenToObj(position)
      }

      // validate position object
      if (!validPositionObject(position)) {
        error(6482, 'Invalid value passed to the position method.', position)
        return
      }

      // default for useAnimations is true
      if (useAnimation !== false) useAnimation = true

      if (useAnimation) {
        // start the animations
        var animations = calculateAnimations(currentPosition, position)
        doAnimations(animations, currentPosition, position)

        // set the new position
        setCurrentPosition(position)
      } else {
        // instant update
        setCurrentPosition(position)
        drawPositionInstant()
      }
    }

    widget.resize = function () {
      // calulate the new square size
      squareSize = calculateSquareSize()

      // set board width
      $board.css('width', squareSize * 8 + 'px')

      // set drag piece size
      $draggedPiece.css({
        height: squareSize,
        width: squareSize
      })

      // spare pieces
      if (config.sparePieces) {
        $container
          .find('.' + CSS.sparePieces)
          .css('paddingLeft', squareSize + boardBorderSize + 'px')
      }

      // redraw the board
      drawBoard()
    }

    // set the starting position
    widget.start = function (useAnimation) {
      widget.position('start', useAnimation)
    }

    // -------------------------------------------------------------------------
    // Browser Events
    // -------------------------------------------------------------------------

    function stopDefault (evt) {
      evt.preventDefault()
    }

    function mousedownSquare (evt) {
      // do nothing if we're not draggable
      if (!config.draggable) return

      // do nothing if there is no piece on this square
      var square = $(this).attr('data-square')
      if (!validSquare(square)) return
      if (!currentPosition.hasOwnProperty(square)) return

      beginDraggingPiece(square, currentPosition[square], evt.pageX, evt.pageY)
    }

    function touchstartSquare (e) {
      // do nothing if we're not draggable
      if (!config.draggable) return

      // do nothing if there is no piece on this square
      var square = $(this).attr('data-square')
      if (!validSquare(square)) return
      if (!currentPosition.hasOwnProperty(square)) return

      e = e.originalEvent
      beginDraggingPiece(
        square,
        currentPosition[square],
        e.changedTouches[0].pageX,
        e.changedTouches[0].pageY
      )
    }

    function mousedownSparePiece (evt) {
      // do nothing if sparePieces is not enabled
      if (!config.sparePieces) return

      var piece = $(this).attr('data-piece')

      beginDraggingPiece('spare', piece, evt.pageX, evt.pageY)
    }

    function touchstartSparePiece (e) {
      // do nothing if sparePieces is not enabled
      if (!config.sparePieces) return

      var piece = $(this).attr('data-piece')

      e = e.originalEvent
      beginDraggingPiece(
        'spare',
        piece,
        e.changedTouches[0].pageX,
        e.changedTouches[0].pageY
      )
    }

    function mousemoveWindow (evt) {
      if (isDragging) {
        updateDraggedPiece(evt.pageX, evt.pageY)
      }
    }

    var throttledMousemoveWindow = throttle(mousemoveWindow, config.dragThrottleRate)

    function touchmoveWindow (evt) {
      // do nothing if we are not dragging a piece
      if (!isDragging) return

      // prevent screen from scrolling
      evt.preventDefault()

      updateDraggedPiece(evt.originalEvent.changedTouches[0].pageX,
        evt.originalEvent.changedTouches[0].pageY)
    }

    var throttledTouchmoveWindow = throttle(touchmoveWindow, config.dragThrottleRate)

    function mouseupWindow (evt) {
      // do nothing if we are not dragging a piece
      if (!isDragging) return

      // get the location
      var location = isXYOnSquare(evt.pageX, evt.pageY)

      stopDraggedPiece(location)
    }

    function touchendWindow (evt) {
      // do nothing if we are not dragging a piece
      if (!isDragging) return

      // get the location
      var location = isXYOnSquare(evt.originalEvent.changedTouches[0].pageX,
        evt.originalEvent.changedTouches[0].pageY)

      stopDraggedPiece(location)
    }

    function mouseenterSquare (evt) {
      // do not fire this event if we are dragging a piece
      // NOTE: this should never happen, but it's a safeguard
      if (isDragging) return

      // exit if they did not provide a onMouseoverSquare function
      if (!isFunction(config.onMouseoverSquare)) return

      // get the square
      var square = $(evt.currentTarget).attr('data-square')

      // NOTE: this should never happen; defensive
      if (!validSquare(square)) return

      // get the piece on this square
      var piece = false
      if (currentPosition.hasOwnProperty(square)) {
        piece = currentPosition[square]
      }

      // execute their function
      config.onMouseoverSquare(square, piece, deepCopy(currentPosition), currentOrientation)
    }

    function mouseleaveSquare (evt) {
      // do not fire this event if we are dragging a piece
      // NOTE: this should never happen, but it's a safeguard
      if (isDragging) return

      // exit if they did not provide an onMouseoutSquare function
      if (!isFunction(config.onMouseoutSquare)) return

      // get the square
      var square = $(evt.currentTarget).attr('data-square')

      // NOTE: this should never happen; defensive
      if (!validSquare(square)) return

      // get the piece on this square
      var piece = false
      if (currentPosition.hasOwnProperty(square)) {
        piece = currentPosition[square]
      }

      // execute their function
      config.onMouseoutSquare(square, piece, deepCopy(currentPosition), currentOrientation)
    }

    // -------------------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------------------

    function addEvents () {
      // prevent "image drag"
      $('body').on('mousedown mousemove', '.' + CSS.piece, stopDefault)

      // mouse drag pieces
      $board.on('mousedown', '.' + CSS.square, mousedownSquare)
      $container.on('mousedown', '.' + CSS.sparePieces + ' .' + CSS.piece, mousedownSparePiece)

      // mouse enter / leave square
      $board
        .on('mouseenter', '.' + CSS.square, mouseenterSquare)
        .on('mouseleave', '.' + CSS.square, mouseleaveSquare)

      // piece drag
      var $window = $(window)
      $window
        .on('mousemove', throttledMousemoveWindow)
        .on('mouseup', mouseupWindow)

      // touch drag pieces
      if (isTouchDevice()) {
        $board.on('touchstart', '.' + CSS.square, touchstartSquare)
        $container.on('touchstart', '.' + CSS.sparePieces + ' .' + CSS.piece, touchstartSparePiece)
        $window
          .on('touchmove', throttledTouchmoveWindow)
          .on('touchend', touchendWindow)
      }
    }

    function initDOM () {
      // create unique IDs for all the elements we will create
      createElIds()

      // build board and save it in memory
      $container.html(buildContainerHTML(config.sparePieces))
      $board = $container.find('.' + CSS.board)

      if (config.sparePieces) {
        $sparePiecesTop = $container.find('.' + CSS.sparePiecesTop)
        $sparePiecesBottom = $container.find('.' + CSS.sparePiecesBottom)
      }

      // create the drag piece
      var draggedPieceId = uuid()
      $('body').append(buildPieceHTML('wP', true, draggedPieceId))
      $draggedPiece = $('#' + draggedPieceId)

      // TODO: need to remove this dragged piece element if the board is no
      // longer in the DOM

      // get the border size
      boardBorderSize = parseInt($board.css('borderLeftWidth'), 10)

      // set the size and draw the board
      widget.resize()
    }

    // -------------------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------------------

    setInitialState()
    initDOM()
    addEvents()

    // return the widget object
    return widget
  } // end constructor

  // TODO: do module exports here
  window['Chessboard'] = constructor

  // support legacy ChessBoard name
  window['ChessBoard'] = window['Chessboard']

  // expose util functions
  window['Chessboard']['fenToObj'] = fenToObj
  window['Chessboard']['objToFen'] = objToFen
})() // end anonymous wrapper
