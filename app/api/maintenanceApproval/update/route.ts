import { NextResponse } from "next/server";


export async function POST(
  req: Request
){

  try {


    const body =
      await req.json();



    const gasUrl =
      process.env
      .NEXT_PUBLIC_GAS_URL;



    if(!gasUrl){

      return NextResponse.json({
        success:false,
        error:"GAS URL kosong"
      });

    }



    const response =
      await fetch(
        gasUrl,
        {

          method:"POST",

          headers:{
            "Content-Type":
            "application/json"
          },


          body:
          JSON.stringify(body)

        }
      );



    const result =
      await response.json();



    return NextResponse.json(
      result
    );



  }catch(error){


    console.error(error);


    return NextResponse.json({

      success:false,

      error:
      String(error)

    });


  }


}