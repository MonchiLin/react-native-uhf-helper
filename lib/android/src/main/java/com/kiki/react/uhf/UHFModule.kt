package com.kiki.react.uhf

import android.os.RemoteException
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.olc.uhf.UhfAdapter
import com.olc.uhf.tech.ISO1800_6C
import com.olc.uhf.tech.IUhfCallback

val TAG = "kiki"
val ModuleName = "UHF"

class RNUHFModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    var eventEmitter: DeviceEventManagerModule.RCTDeviceEventEmitter? = null

    var uhf_6c: ISO1800_6C? = null

    var reactContext: ReactContext? = null

    var readerThread: Thread? = null

    var loop = false

    init {
        this.reactContext = reactContext
    }

    @ReactMethod
    fun initUHF() {
        val mService = UhfAdapter.getUhfManager(this.reactApplicationContext)
        uhf_6c = mService.getISO1800_6C()
        eventEmitter = this.reactContext!!.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        this.reader()
    }

    override fun getName(): String {
        return ModuleName
    }

    @ReactMethod
    fun readerStart() {
        if (!readerThread!!.isAlive) {
            readerThread!!.start()
        }
        loop = true
    }

    @ReactMethod
    fun readerStop() {
        if (readerThread!!.isAlive) {
            readerThread!!.interrupt()
        }
        loop = false

    }

    private fun reader(interval: Long = 1000) {
        readerThread = Thread(Runnable {
            while (loop) {
                try {
                    uhf_6c!!.inventory(callback)
                    Thread.sleep(interval);
                } catch (e: InterruptedException) {
                    Log.d(TAG, "enter InterruptedException")
                }
            }
        })
    }

    private val callback: IUhfCallback = object : IUhfCallback.Stub() {
        @Throws(RemoteException::class)
        override fun doInventory(str: List<String>) {
            Log.d(TAG, "enter callback" + str.toString())

            str.forEach { it ->
                Log.d(TAG, "strepc origin=" + it)
                Log.d(TAG, "RSSI=" + it.substring(0, 2))
                Log.d(TAG, "PC=" + it.substring(2, 6))
                Log.d(TAG, "EPC=" + it.substring(6))
                Log.d(TAG, "Capitalization EPC= " + it.substring(2, 6) + it.substring(6))
            }

            eventEmitter!!.emit("reader", Arguments.fromList(str))

        }

        @Throws(RemoteException::class)
        override fun doTIDAndEPC(str: List<String>) {

        }

    }

}