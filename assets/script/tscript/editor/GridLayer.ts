// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GridLayer extends cc.Component {

    private _mapWidth:number;
    private _mapHeight:number;
    
    private _ceilWidth:number;
    private _ceilHeight:number;
    
    private _halfCeilWidth:number;
    private _halfCeilHeight:number;
    
    private lingColor1:string = "#00550010";
    private lingColor2:string = "#11115588";
	private lingColor3:string = "#888888aa";
	
	private _graphics: cc.Graphics = null;
    public get graphics(): cc.Graphics {

        if(!this._graphics)
        {
            this._graphics = this.addComponent(cc.Graphics);
        }

        return this._graphics;
    } 
		
	constructor()
	{
		super();
	}
	
	public drawGrid(mapWidth:number,mapHeight:number,ceilWidth:number,ceilHeight:number,mapType:number):void
	{
		
		this._mapWidth = mapWidth;
		this._mapHeight = mapHeight;
		this._ceilWidth = ceilWidth;
		this._ceilHeight = ceilHeight;
		this._halfCeilWidth = ceilWidth/2;
		this._halfCeilHeight = ceilHeight/2;
		
		var col:number = Math.ceil(mapWidth / this._ceilWidth);
		var row:number = Math.ceil(mapHeight / this._ceilHeight);
		
		var halfCol:number = col * 2 + 1;
		var halfRow:number = row * 2 + 1;
		
		var gridWidth:number = halfCol * this._halfCeilWidth;
		var gridHeight:number = halfRow * this._halfCeilHeight;
		
		if(mapType == 0)
		{
			this.draw45AngleGrid(halfRow,halfCol,gridWidth,gridHeight);
		}else if(mapType == 1)
		{
			this.draw90AngleGrid(halfRow,halfCol,gridWidth,gridHeight);
			
		}else if(mapType == 2)
		{
			this.drawHoneycombGrid(gridWidth,gridHeight);
		}
		
	}
	
	/**
	 *绘制45度角地图格子 
		* @param halfRow 格子行数的一半
		* @param halfCol 格子列数的一半
		* @param gridWidth 格子宽度
		* @param gridHeight 格子高度
		* 
		*/		
	private  draw45AngleGrid(halfRow:number,halfCol:number,gridWidth:number,gridHeight:number):void
	{
		this.graphics.clear();
		
		
		for(var a:number = 0 ; a < halfRow + 1; a++)
		{
			if(a % 2 == 0)
			{
				this.graphics.strokeColor.fromHEX(this.lingColor2);
				this.graphics.lineWidth = 2;
			}else
			{
				this.graphics.strokeColor.fromHEX(this.lingColor1);
				this.graphics.lineWidth = 1.2;
			}
			
			this.graphics.moveTo(0,a * this._halfCeilHeight);
			this.graphics.lineTo(gridWidth, a * this._halfCeilHeight);
			this.graphics.stroke();
		}
		
		for(var b:number = 0 ; b < halfCol + 1; b++)
		{
			if(b % 2 == 0)
			{
				this.graphics.strokeColor.fromHEX(this.lingColor2);
				this.graphics.lineWidth = 1;
			}else
			{
				this.graphics.strokeColor.fromHEX(this.lingColor1);
				this.graphics.lineWidth = 1;
			}
			this.graphics.moveTo(b * this._halfCeilWidth,0);
			this.graphics.lineTo(b * this._halfCeilWidth,gridHeight);
			this.graphics.stroke();
		}
		
		
		for(var i:number = 1 ; i < (halfCol + halfRow); i++)
		{
			this.graphics.strokeColor.fromHEX(this.lingColor3);
			this.graphics.lineWidth = 1.5;
			
			var beginX:number;
			var beginY:number;
			
			var endX:number;
			var endY:number;
			
			if(i % 2 == 1)
			{
				beginX = i * this._halfCeilWidth;
				beginY = 0;
				
				endX = 0;
				endY = i * this._halfCeilHeight;
				
				if(beginX > gridWidth)
				{
					beginX = gridWidth;
					beginY = (i - halfCol) * this._halfCeilHeight;
				}
				
				if(endY > gridHeight)
				{
					endX = (i - halfRow) * this._halfCeilWidth
					endY = gridHeight;
				}
				
				this.graphics.moveTo(beginX,beginY);
				this.graphics.lineTo(endX,endY);
			}else
			{
				beginX = i * this._halfCeilWidth;
				beginY = gridHeight;
				
				endX = 0;
				endY = (halfRow - i) * this._halfCeilHeight;
				
				if(beginX > gridWidth)
				{
					beginX = gridWidth;
					beginY = (halfRow - (i - halfCol)) * this._halfCeilHeight;
				}
				
				if(endY < 0)
				{
					endX = (i - halfRow) * this._halfCeilWidth
					endY = 0;
				}
				
				this.graphics.moveTo(beginX,beginY);
				this.graphics.lineTo(endX,endY);
				this.graphics.stroke();
				
			}	
		}
		
		
	}
	
	/**
	 *绘制90度角地图格子 
		* @param halfRow 格子行数的一半
		* @param halfCol 格子列数的一半
		* @param gridWidth 格子宽度
		* @param gridHeight 格子高度
		* 
		*/			
	private  draw90AngleGrid(halfRow:number,halfCol:number,gridWidth:number,gridHeight:number):void
	{
		this.graphics.clear();
		
		for(var a:number = 0 ; a < halfRow + 1; a++)
		{
			if(a % 2 == 0)
			{
				this.graphics.strokeColor.fromHEX(this.lingColor3);
				this.graphics.lineWidth = 2.5;
			}else
			{
				this.graphics.strokeColor.fromHEX(this.lingColor1);
				this.graphics.lineWidth = 1;
			}
			
			this.graphics.moveTo(0,a * this._halfCeilHeight);
			this.graphics.lineTo(gridWidth, a * this._halfCeilHeight);
			this.graphics.stroke();
		}
		
		for(var b:number = 0 ; b < halfCol + 1; b++)
		{
			if(b % 2 == 0)
			{
				this.graphics.strokeColor.fromHEX(this.lingColor3);
				this.graphics.lineWidth = 2.5;
			}else
			{
				this.graphics.strokeColor.fromHEX(this.lingColor1);
				this.graphics.lineWidth = 1;
			}
			this.graphics.moveTo(b * this._halfCeilWidth,0);
			this.graphics.lineTo(b * this._halfCeilWidth,gridHeight);
			this.graphics.stroke();
		}
		
	}
	
	private  drawHoneycombGrid(gridWidth:number,gridHeight:number):void
	{
		this.graphics.clear();
		
		this._ceilHeight = (this._ceilWidth / 2) * 1.732;
		
		var radius:number = this._ceilWidth / 2; //六边形半径
		
		var cwDiv4_1:number = this._ceilWidth / 4; //六边形直径的四分之一
		var cwDiv4_2:number = cwDiv4_1 * 2;         //六边形直径的四分之二，也就是半径
		var cwDiv4_3:number = cwDiv4_1 * 3;         //六边形直径的四分之三
		var chDiv2_1:number = this._ceilHeight / 2;     //六边形的两条平行线之间的距离的一半 1.732 = 3的平方根
		var hm:number = cwDiv4_2 - chDiv2_1;    
		
		//var hd:number = hm;
		var hd:number = 0;
		
		var n:number = gridWidth / this._ceilWidth; //矩形网格横轴数
		var m:number = gridHeight / this._ceilWidth; //矩形网格纵轴数
		
		var c:number = Math.ceil((this._mapWidth - cwDiv4_1) / (cwDiv4_1 * 6)) * 2;
		var r:number = Math.ceil((this._mapHeight - chDiv2_1) / this._ceilHeight);
		
		for (var a:number = 0; a < m * 4 + 1; a++)
		{
			if (a % 4 == 0)
			{
				this.graphics.strokeColor.fromHEX(this.lingColor2);
				this.graphics.lineWidth = 1;
			}
			else
			{
				this.graphics.strokeColor.fromHEX(this.lingColor1);
				this.graphics.lineWidth = 1.2;
			}
			
			if (a % 4 == 1)
			{
				this.graphics.moveTo(0,(a - 1) * cwDiv4_1 + hm);
				this.graphics.lineTo(gridWidth, (a - 1) * cwDiv4_1 + hm);
				this.graphics.stroke();
			}
			else if (a % 4 == 3)
			{
				this.graphics.moveTo(0,(a - 1) * cwDiv4_1 + chDiv2_1);
				this.graphics.lineTo(gridWidth, (a - 1) * cwDiv4_1 + chDiv2_1);
				this.graphics.stroke();
			}
			else
			{
				this.graphics.moveTo(0,a * cwDiv4_1);
				this.graphics.lineTo(gridWidth, a * cwDiv4_1);
				this.graphics.stroke();
			}
		}
		
		for (var b:number = 0; b < n * 4 + 1; b++)
		{
			if (b % 4 == 0)
			{
				this.graphics.strokeColor.fromHEX(this.lingColor2);
				this.graphics.lineWidth = 1;
			}
			else
			{
				this.graphics.strokeColor.fromHEX(this.lingColor1);
				this.graphics.lineWidth = 1;
			}
			this.graphics.moveTo(b * cwDiv4_1,0);
			this.graphics.lineTo(b * cwDiv4_1,gridHeight);
			this.graphics.stroke();
		}
		
		
		this.graphics.strokeColor.fromHEX(this.lingColor3);
		this.graphics.lineWidth = 1.5;
		
		for (var i:number = 0; i < c; i++)
		{
			var ws:number = i * cwDiv4_3;
			
			var hh:number = 0;
			
			if (i % 2 != 0)
			{
				hh = chDiv2_1;
			}
			
			for (var j:number = 0; j < r; j++)
			{
				
				var hs:number = j * this._ceilHeight + hh;
				
				if (i % 2 == 0)
				{
					this.drawLine(ws + cwDiv4_1,hd + hs,ws + cwDiv4_3,hd + hs);
					this.drawLine(ws + cwDiv4_3,hd + hs,ws + this._ceilWidth,chDiv2_1 + hs);
					this.drawLine(ws + this._ceilWidth,chDiv2_1 + hs,ws + cwDiv4_3,this._ceilHeight + hs);
					if(j == r - 1)
					{
						this.drawLine(ws + cwDiv4_3,this._ceilHeight + hs,ws + cwDiv4_1 , this._ceilHeight + hs);
					}
					this.drawLine(ws + cwDiv4_1 , this._ceilHeight + hs,ws + 0,chDiv2_1 + hs);
					this.drawLine(ws + 0,chDiv2_1 + hs,ws + cwDiv4_1,hd + hs);
				}
				else
				{
					this.drawLine(ws + cwDiv4_1,hd + hs,ws + cwDiv4_3,hd + hs);
					if (i == c - 1)
					{
						this.drawLine(ws + cwDiv4_3,hd + hs,ws + this._ceilWidth,chDiv2_1 + hs);
						this.drawLine(ws + this._ceilWidth,chDiv2_1 + hs,ws + cwDiv4_3,this._ceilHeight + hs);
					}
					
					if (j == r - 1)
					{
						this.drawLine(ws + cwDiv4_3,this._ceilHeight + hs,ws + cwDiv4_1 , this._ceilHeight + hs);
						this.drawLine(ws + cwDiv4_1 , this._ceilHeight + hs,ws + 0,chDiv2_1 + hs);
						if(i != c - 1)
						{
							this.drawLine(ws + this._ceilWidth,chDiv2_1 + hs,ws + cwDiv4_3,this._ceilHeight + hs);
						}
	
					}
					
				}
				
				/*var px:number = (2 + 3 * i)/4 * this._ceilWidth;
				var py:number = (j + 1/2 *( 1 + (i % 2))) * this._ceilHeight;
				
				var textf:TextField = new TextField();
				this.addChild(textf);
				textf.text = "(" + i + "," + j + ")";
				textf.x = px - 15;
				textf.y = py + hd - 10;*/
				
			}
		}
		
		//this.graphics.stroke();
	}
	
	private drawLine(x1:number,y1:number,x2:number,y2:number):void
	{
		this.graphics.moveTo(x1,y1);
		this.graphics.lineTo(x2,y2);
		this.graphics.stroke();
	}
}
